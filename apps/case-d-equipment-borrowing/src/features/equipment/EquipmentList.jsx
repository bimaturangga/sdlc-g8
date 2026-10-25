import EquipmentCard from './EquipmentCard.jsx';

export default function EquipmentList({
  equipment,
  selectedId,
  onSelect,
  onToggleMaintenance,
  onAddUnit,
}) {
  if (equipment.length === 0) {
    return <div className="empty-state">No equipment records are available.</div>;
  }

  return (
    <ul className="record-list" aria-label="Campus equipment">
      {equipment.map((equipmentItem) => (
        <li key={equipmentItem.id}>
          <EquipmentCard
            equipmentItem={equipmentItem}
            isSelected={equipmentItem.id === selectedId}
            onSelect={onSelect}
          />
          {onToggleMaintenance && (
            <div className="unit-management" aria-label={`Units for ${equipmentItem.name}`}>
              <h3>Individual units</h3>
              {equipmentItem.units.length === 0 ? (
                <p className="meta">No units added yet.</p>
              ) : (
                <ul className="unit-list">
                  {equipmentItem.units.map((unit) => (
                    <li className="unit-row" key={unit.id}>
                      <span>
                        <strong>{unit.id}</strong>
                        <span
                          className={`status-badge ${
                            unit.maintenance ? 'warning' : 'success'
                          }`}
                        >
                          {unit.maintenance ? 'MAINTENANCE' : 'AVAILABLE'}
                        </span>
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
              <button
                className="secondary-button add-unit-button"
                type="button"
                onClick={() => onAddUnit(equipmentItem.id)}
              >
                Add unit
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
