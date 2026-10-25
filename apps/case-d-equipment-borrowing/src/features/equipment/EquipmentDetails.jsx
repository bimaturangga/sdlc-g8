import {
  canCreateDemoRequest,
  getAvailableUnitCount,
  getMaintenanceUnitCount,
} from '../../utils/equipmentUtils.js';

export default function EquipmentDetails({ equipmentItem, onCreateRequest }) {
  if (!equipmentItem) {
    return <div className="empty-state">Select equipment to view its details.</div>;
  }

  const canRequest = canCreateDemoRequest(equipmentItem);
  const availableUnits = getAvailableUnitCount(equipmentItem);
  const maintenanceUnits = getMaintenanceUnitCount(equipmentItem);
  const status = canRequest
    ? 'AVAILABLE'
    : maintenanceUnits > 0
      ? 'UNDER MAINTENANCE'
      : 'UNAVAILABLE';

  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{equipmentItem.id}</p>
          <h2>{equipmentItem.name}</h2>
        </div>
        <span
          className={`status-badge ${
            canRequest ? 'success' : maintenanceUnits > 0 ? 'warning' : 'neutral'
          }`}
        >
          {status}
        </span>
      </div>

      <dl className="details-list">
        <dt>Category</dt>
        <dd>{equipmentItem.category}</dd>
        <dt>Available units</dt>
        <dd>{availableUnits}</dd>
        <dt>Units under maintenance</dt>
        <dd>{maintenanceUnits}</dd>
      </dl>

      <button
        className="primary-button"
        type="button"
        onClick={() => onCreateRequest(equipmentItem.id)}
        disabled={!canRequest}
      >
        {maintenanceUnits > 0 && availableUnits === 0
          ? 'Under Maintenance'
          : canRequest
            ? 'Create Demo Request'
            : 'No Units Available'}
      </button>
      <p className="helper-text">
        A demo request is only a record. It does not reduce available units.
      </p>
    </>
  );
}
