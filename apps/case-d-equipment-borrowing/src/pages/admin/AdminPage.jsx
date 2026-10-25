import AppHeader from '../../components/AppHeader.jsx';
import ResetControl from '../../components/ResetControl.jsx';
import EquipmentList from '../../features/equipment/EquipmentList.jsx';
import RequestList from '../../features/requests/RequestList.jsx';

export default function AdminPage({
  user,
  data,
  onReset,
  onToggleMaintenance,
  onLogout,
}) {
  const availableCount = data.equipment.filter(
    (item) => item.availableUnits > 0 && !item.maintenance,
  ).length;
  const maintenanceCount = data.equipment.filter((item) => item.maintenance).length;

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
          <p className="summary-label">Records with available units</p>
          <p className="summary-value">{availableCount}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Under maintenance</p>
          <p className="summary-value">{maintenanceCount}</p>
        </article>
      </section>

      <section className="panel" aria-labelledby="admin-equipment-heading">
        <h2 id="admin-equipment-heading">All Equipment</h2>
        <EquipmentList
          equipment={data.equipment}
          selectedId={null}
          onSelect={() => {}}
          onToggleMaintenance={onToggleMaintenance}
        />
      </section>

      <section className="panel secondary-section" aria-labelledby="admin-request-heading">
        <div className="panel-heading">
          <h2 id="admin-request-heading">All Requests</h2>
          <span className="meta">{data.requests.length} total</span>
        </div>
        <RequestList requests={data.requests} equipment={data.equipment} />
      </section>
    </main>
  );
}
