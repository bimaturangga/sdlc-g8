import { getEquipmentName } from '../../utils/equipmentUtils.js';
import { getRequestConflict } from '../../utils/unitAvailability.js';
import StatusBadge from '../../components/StatusBadge.jsx';

export default function RequestList({ requests, equipment, staffView = false, onConfirm }) {
  if (requests.length === 0) {
    return <div className="empty-state">No demo requests have been recorded.</div>;
  }

  return (
    <ul className="secondary-list" aria-label="Demo equipment requests">
      {requests.map((request) => (
        <li className="secondary-row" key={request.id}>
          <div>
            <p>
              <strong>{getEquipmentName(equipment, request.equipmentId)}</strong>
            </p>
            <span className="meta">
              {request.id}
              {request.unitId ? ` · ${request.unitId}` : ''}
              {request.startDate && request.endDate
                ? ` · ${request.startDate} to ${request.endDate}`
                : ''}
            </span>
            {staffView && request.status === 'REQUESTED' && (() => {
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
            {staffView && request.status === 'REQUESTED' && (
              <button
                className="primary-button"
                type="button"
                onClick={() => onConfirm(request.id)}
              >
                Confirm request
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
