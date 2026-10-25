import AppHeader from '../../components/AppHeader.jsx';
import ResetControl from '../../components/ResetControl.jsx';
import UnitFilterPanel from '../../features/units/UnitFilterPanel.jsx';
import {
  getAvailableUnitCount,
  getMaintenanceUnitCount,
} from '../../utils/equipmentUtils.js';

export default function AdminPage({
  user,
  data,
  onReset,
  onToggleMaintenance,
  onAddUnit,
  onConfirmRequest,
  onLogout,
}) {
  const availableCount = data.equipment.reduce(
    (total, item) => total + getAvailableUnitCount(item),
    0,
  );
  const maintenanceCount = data.equipment.reduce(
    (total, item) => total + getMaintenanceUnitCount(item),
    0,
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
        onConfirmRequest={onConfirmRequest}
      />
    </main>
  );
}
