import {
  getAvailableUnitCount,
  getMaintenanceUnitCount,
} from '../../utils/equipmentUtils.js';

export default function EquipmentCard({
  equipmentItem,
  isSelected,
  onSelect,
  requests = [],
  period,
}) {
  const availableUnits = getAvailableUnitCount(equipmentItem, requests, period);
  const maintenanceUnits = getMaintenanceUnitCount(equipmentItem);
  const status = availableUnits > 0
    ? 'AVAILABLE'
    : maintenanceUnits > 0
      ? 'UNDER MAINTENANCE'
      : 'UNAVAILABLE';

  return (
    <button
      className={`record-card${isSelected ? ' selected' : ''}`}
      type="button"
      onClick={() => onSelect(equipmentItem.id)}
      aria-pressed={isSelected}
    >
      <span className="card-heading">
        <span>
          <strong>{equipmentItem.name}</strong>
          <span className="meta"> · {equipmentItem.id}</span>
        </span>
        <span
          className={`status-badge ${
            availableUnits > 0 ? 'success' : maintenanceUnits > 0 ? 'warning' : 'neutral'
          }`}
        >
          {status}
        </span>
      </span>
      <span className="card-footer">
        <span>{equipmentItem.category}</span>
        <span>
          {availableUnits} available · {maintenanceUnits} maintenance
        </span>
      </span>
    </button>
  );
}
