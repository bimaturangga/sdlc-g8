import { useState } from 'react';
import AppHeader from '../../components/AppHeader.jsx';
import ResetControl from '../../components/ResetControl.jsx';
import UnitFilterPanel from '../../features/units/UnitFilterPanel.jsx';
import {
  getAvailableUnitCount,
  getEquipmentName,
  getMaintenanceUnitCount,
} from '../../utils/equipmentUtils.js';

export default function AdminPage({
  user,
  data,
  onReset,
  onToggleMaintenance,
  onAddUnit,
  onUpdateRequestStatus,
  onLogout,
}) {
  const [areDecisionsOpen, setAreDecisionsOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const currentPeriod = { start: today, end: today };
  const availableCount = data.equipment.reduce(
    (total, item) => total + getAvailableUnitCount(item, data.requests, currentPeriod),
    0,
  );
  const maintenanceCount = data.equipment.reduce(
    (total, item) => total + getMaintenanceUnitCount(item),
    0,
  );
  const decidedRequests = data.requests.filter((request) =>
    ['APPROVED', 'REJECTED'].includes(request.status),
  );

  return (
    <main className="app-shell">
      <AppHeader user={user} onLogout={onLogout}>
        <ResetControl onReset={onReset} />
      </AppHeader>

      <p className="browser-note">Demo data is saved in this browser only.</p>

      <section className="overview-grid" aria-label="Overview">
        <article className="summary-card">
          <p className="summary-label">Equipment records</p>
          <p className="summary-value">{data.equipment.length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Available units</p>
          <p className="summary-value">{availableCount}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Units under maintenance</p>
          <p className="summary-value">{maintenanceCount}</p>
        </article>
      </section>

      <UnitFilterPanel
        equipment={data.equipment}
        requests={data.requests}
        onToggleMaintenance={onToggleMaintenance}
        onAddUnit={onAddUnit}
        onUpdateRequestStatus={onUpdateRequestStatus}
      />

      <section className="panel decision-panel" aria-labelledby="request-decisions-heading">
        <div className="panel-heading">
          <h2 id="request-decisions-heading">Request Decisions</h2>
          <button
            className="secondary-button"
            type="button"
            aria-expanded={areDecisionsOpen}
            aria-controls="request-decisions-list"
            onClick={() => setAreDecisionsOpen((isOpen) => !isOpen)}
          >
            {areDecisionsOpen ? 'Close' : `Lihat semua (${decidedRequests.length})`}
          </button>
        </div>
        <div id="request-decisions-list" hidden={!areDecisionsOpen}>
          {decidedRequests.length === 0 ? (
            <div className="empty-state">No requests have been approved or rejected yet.</div>
          ) : (
            <ul className="decision-card-list" aria-live="polite">
              {decidedRequests.map((request) => {
                const isApproved = request.status === 'APPROVED';
                return (
                  <li className="decision-card" key={request.id}>
                    <div className="decision-card-details">
                      <strong>{getEquipmentName(data.equipment, request.equipmentId)}</strong>
                      <span className="meta">
                        {request.id}
                        {request.unitId ? ` · Unit: ${request.unitId}` : ''}
                        {request.startDate && request.endDate
                          ? ` · ${request.startDate} s/d ${request.endDate}`
                          : ''}
                      </span>
                      {request.studentName && (
                        <span className="meta">{request.studentName}</span>
                      )}
                    </div>
                    <span className={`status-badge ${isApproved ? 'info' : 'danger'}`}>
                      {isApproved ? 'RESERVED' : 'REJECTED'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
