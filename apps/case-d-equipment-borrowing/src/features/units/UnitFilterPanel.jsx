import { useEffect, useRef, useState } from 'react';
import {
  UNIT_STATUS,
  getUnitsWithStatus,
  isValidPeriod,
} from '../../utils/unitAvailability.js';
import { getNextUnitId } from '../../utils/equipmentUtils.js';
import RequestList from '../requests/RequestList.jsx';

const STATUS_OPTIONS = [
  UNIT_STATUS.AVAILABLE,
  UNIT_STATUS.RESERVED,
  UNIT_STATUS.MAINTENANCE,
];

const TONES = {
  [UNIT_STATUS.AVAILABLE]: 'success',
  [UNIT_STATUS.RESERVED]: 'info',
  [UNIT_STATUS.MAINTENANCE]: 'warning',
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterChips({ name, options, selected, onChange }) {
  return (
    <div className="chip-row">
      <label className="chip">
        <input
          type="checkbox"
          name={name}
          checked={selected.length === 0}
          onChange={() => onChange([])}
        />
        All
      </label>
      {options.map((option) => (
        <label className="chip" key={option.value}>
          <input
            type="checkbox"
            name={name}
            checked={selected.includes(option.value)}
            onChange={() => onChange(toggleValue(selected, option.value))}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

export default function UnitFilterPanel({
  equipment,
  requests,
  onToggleMaintenance,
  onAddUnit,
  onUpdateRequestStatus,
}) {
  const [period, setPeriod] = useState(() => ({ start: todayIso(), end: todayIso() }));
  const [statuses, setStatuses] = useState([]);
  const [equipmentIds, setEquipmentIds] = useState([]);

  const [openMenu, setOpenMenu] = useState(null);
  const [addTargetId, setAddTargetId] = useState('');
  const menuRef = useRef(null);
  const isOpen = openMenu === 'filter';
  const isAddOpen = openMenu === 'add';
  const isRequestsOpen = openMenu === 'requests';
  const addTargetValue = equipment.some((item) => item.id === addTargetId)
    ? addTargetId
    : (equipment[0]?.id ?? '');

  useEffect(() => {
    if (!openMenu) return undefined;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenu(null);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenMenu(null);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  const periodIsValid = isValidPeriod(period);

  const groups = periodIsValid
    ? equipment
        .filter((item) => equipmentIds.length === 0 || equipmentIds.includes(item.id))
        .map((item) => ({
          equipmentItem: item,
          rows: getUnitsWithStatus(item, requests, period).filter((row) =>
            statuses.length === 0 || statuses.includes(row.status),
          ),
        }))
    : [];
  const activeFilterCount =
    (statuses.length > 0 ? 1 : 0) + (equipmentIds.length > 0 ? 1 : 0);
  const totalRows = groups.reduce((total, group) => total + group.rows.length, 0);

  return (
    <section className="panel" aria-labelledby="admin-equipment-heading">
      <div className="panel-heading">
        <h2 id="admin-equipment-heading">All Equipment</h2>
        <div className="panel-actions" ref={menuRef}>
        <div className="filter-menu">
          <button
            className="secondary-button"
            type="button"
            aria-haspopup="true"
            aria-expanded={isAddOpen}
            onClick={() => setOpenMenu(isAddOpen ? null : 'add')}
            disabled={equipment.length === 0}
          >
            Add unit
          </button>
          {isAddOpen && (
            <div className="filter-dropdown add-unit-dropdown" role="dialog" aria-label="Add unit">
              <div className="add-unit-header">
                <span className="add-unit-icon" aria-hidden="true">+</span>
                <div>
                  <h3>Add new unit</h3>
                  <p className="meta">Choose the equipment that gets a new physical unit.</p>
                </div>
              </div>

              <div className="add-unit-options" role="radiogroup" aria-label="Equipment">
                {equipment.map((item) => (
                  <label
                    className={`add-unit-option${item.id === addTargetValue ? ' selected' : ''}`}
                    key={item.id}
                  >
                    <input
                      type="radio"
                      name="add-unit-equipment"
                      checked={item.id === addTargetValue}
                      onChange={() => setAddTargetId(item.id)}
                    />
                    <span className="add-unit-option-text">
                      <strong>{item.name}</strong>
                      <span className="meta">
                        {item.id} · {item.units.length} unit{item.units.length === 1 ? '' : 's'}
                      </span>
                    </span>
                    <span className="add-unit-check" aria-hidden="true">✓</span>
                  </label>
                ))}
              </div>

              <div className="add-unit-preview">
                <span className="meta">New inventory number</span>
                <code>{getNextUnitId(equipment.find((item) => item.id === addTargetValue))}</code>
              </div>

              <div className="filter-actions">
                <button className="link-button" type="button" onClick={() => setOpenMenu(null)}>
                  Cancel
                </button>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    onAddUnit(addTargetValue);
                    setOpenMenu(null);
                  }}
                >
                  Add unit
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="filter-menu">
          <button
            className="secondary-button"
            type="button"
            aria-haspopup="true"
            aria-expanded={isRequestsOpen}
            onClick={() => setOpenMenu(isRequestsOpen ? null : 'requests')}
          >
            Request Item ({requests.length})
          </button>
          {isRequestsOpen && (
            <div
              className="filter-dropdown request-item-dropdown"
              role="dialog"
              aria-label="All requests"
            >
              <div className="panel-heading">
                <h2 id="admin-request-heading">All Requests</h2>
                <span className="meta">{requests.length} total</span>
              </div>
              <RequestList
                requests={requests}
                equipment={equipment}
                staffView
                onUpdateRequestStatus={onUpdateRequestStatus}
              />
            </div>
          )}
        </div>
        <div className="filter-menu">
          <button
            className="secondary-button"
            type="button"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={() => setOpenMenu(isOpen ? null : 'filter')}
          >
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
          {isOpen && (
            <div className="filter-dropdown" role="dialog" aria-label="Filters">
        <div className="filter-group">
          <span className="filter-label">Period</span>
          <div className="period-form">
            <label>
              From
              <input
                type="date"
                value={period.start}
                onChange={(event) =>
                  setPeriod((current) => ({ ...current, start: event.target.value }))
                }
              />
            </label>
            <label>
              Until
              <input
                type="date"
                value={period.end}
                min={period.start}
                onChange={(event) =>
                  setPeriod((current) => ({ ...current, end: event.target.value }))
                }
              />
            </label>
          </div>
        </div>

        <div className="filter-group" role="group" aria-label="Filter by status">
          <span className="filter-label">Status</span>
          <FilterChips
            name="unit-status-filter"
            options={STATUS_OPTIONS.map((option) => ({ value: option, label: option }))}
            selected={statuses}
            onChange={setStatuses}
          />
        </div>

        <div className="filter-group" role="group" aria-label="Filter by equipment">
          <span className="filter-label">Equipment</span>
          <FilterChips
            name="unit-equipment-filter"
            options={equipment.map((item) => ({ value: item.id, label: item.name }))}
            selected={equipmentIds}
            onChange={setEquipmentIds}
          />
        </div>

        <div className="filter-actions">
                <button
                  className="link-button"
                  type="button"
                  onClick={() => {
                    setStatuses([]);
                    setEquipmentIds([]);
                    setPeriod({ start: todayIso(), end: todayIso() });
                  }}
                >
                  Reset filters
                </button>
                <button className="primary-button" type="button" onClick={() => setOpenMenu(null)}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {!periodIsValid ? (
        <div className="empty-state">Choose a start date that is not after the end date.</div>
      ) : (
        <>
          <p className="meta" aria-live="polite">
            {totalRows} unit{totalRows === 1 ? '' : 's'} shown
          </p>
          {groups.length === 0 ? (
            <div className="empty-state">No equipment matches the selected filter.</div>
          ) : (
            <div className="unit-availability-groups">
              {groups.map(({ equipmentItem, rows }) => (
                <div className="unit-management" key={equipmentItem.id}>
                  <h3>
                    {equipmentItem.name}
                    <span className="meta"> · {equipmentItem.id}</span>
                  </h3>
                  {rows.length === 0 ? (
                    <p className="meta">No units match the selected filters.</p>
                  ) : (
                    <ul className="unit-list" aria-label={`Units of ${equipmentItem.name}`}>
                      {rows.map(({ unit, status, request }) => (
                        <li className="unit-row" key={unit.id}>
                          <span>
                            <strong>{unit.id}</strong>
                            <span className={`status-badge ${TONES[status]}`}>{status}</span>
                            {request && (
                              <span className="meta">
                                {request.id} · {request.startDate} to {request.endDate}
                              </span>
                            )}
                          </span>
                          <button
                            className="maintenance-button"
                            type="button"
                            onClick={() => onToggleMaintenance(equipmentItem.id, unit.id)}
                            aria-pressed={unit.maintenance}
                          >
                            {unit.maintenance ? 'Clear maintenance' : 'Mark maintenance'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
