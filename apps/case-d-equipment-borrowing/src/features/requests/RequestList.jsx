import { getEquipmentName } from '../../utils/equipmentUtils.js';
import { getRequestConflict } from '../../utils/unitAvailability.js';
import StatusBadge from '../../components/StatusBadge.jsx';

const PENDING_STATUSES = new Set(['REQUESTED', 'WAITING_APPROVAL']);

export default function RequestList({
  requests,
  equipment,
  staffView = false,
  onUpdateRequestStatus,
}) {
  if (requests.length === 0) {
    return <div className="empty-state">No demo requests have been recorded.</div>;
  }

  return (
    <ul className="secondary-list" aria-label="Demo equipment requests">
      {requests.map((request) => (
        <li className="secondary-row" key={request.id}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <p>
              <strong>{getEquipmentName(equipment, request.equipmentId)}</strong>
              {request.studentName ? ` · ${request.studentName}` : ''}
              {request.studentNim && request.studentNim !== '-' ? ` (${request.studentNim})` : ''}
            </p>
            <span className="meta">
              {request.id}
              {request.studentProdi && request.studentProdi !== '-' ? ` · ${request.studentProdi}` : ''}
              {request.startDate && request.endDate
                ? ` · Periode: ${request.startDate} s/d ${request.endDate}`
                : ''}
              {request.unitId ? ` · Unit: ${request.unitId}` : ''}
            </span>
            {staffView && PENDING_STATUSES.has(request.status) && (() => {
              const check = getRequestConflict(request, requests, equipment);
              return (
                <div className={`conflict-check ${check.status}`} role="status">
                  <strong>
                    {check.status === 'conflict'
                      ? 'Conflict detected'
                      : check.status === 'unknown'
                        ? 'Conflict check incomplete'
                        : 'No conflict detected'}
                  </strong>
                  <span>{check.message}</span>
                </div>
              );
            })()}
          </div>
          <div className="request-actions">
            <StatusBadge status={request.status} />
            {staffView && PENDING_STATUSES.has(request.status) && (
              <div className="request-decision-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => onUpdateRequestStatus(request.id, 'APPROVED')}
                >
                  Approve
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onUpdateRequestStatus(request.id, 'REJECTED')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
