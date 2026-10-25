import {
  canCreateDemoRequest,
  getAvailableUnitCount,
  getMaintenanceUnitCount,
} from '../../utils/equipmentUtils.js';

export default function EquipmentDetails({
  equipmentItem,
  onOpenBorrowModal,
}) {
  if (!equipmentItem) {
    return <div className="empty-state">Pilih peralatan untuk melihat rincian dan mengajukan peminjaman.</div>;
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

      <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
        <button
          className="primary-button"
          type="button"
          onClick={() => onOpenBorrowModal(equipmentItem.id)}
          disabled={!canRequest}
          style={{ width: '100%', minHeight: '42px', fontSize: '0.95rem' }}
        >
          {maintenanceUnits > 0 && availableUnits === 0
            ? 'Sedang Dalam Perbaikan'
            : canRequest
              ? 'Ajukan Peminjaman'
              : 'Tidak Ada Unit Tersedia'}
        </button>

      </div>
    </>
  );
}
