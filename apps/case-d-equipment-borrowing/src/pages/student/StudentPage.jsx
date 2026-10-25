import { useState } from 'react';
import AppHeader from '../../components/AppHeader.jsx';
import EquipmentDetails from '../../features/equipment/EquipmentDetails.jsx';
import EquipmentList from '../../features/equipment/EquipmentList.jsx';
import RequestList from '../../features/requests/RequestList.jsx';

export default function StudentPage({ user, data, onCreateRequest, onLogout }) {
  const [selectedId, setSelectedId] = useState(() => data.equipment[0]?.id ?? null);

  const selectedEquipment =
    data.equipment.find((item) => item.id === selectedId) ?? null;

  return (
    <main className="app-shell">
      <AppHeader user={user} onLogout={onLogout} />

      <p className="browser-note">Demo data is saved in this browser only.</p>

      <section className="content-grid">
        <section className="panel" aria-labelledby="equipment-list-heading">
          <h2 id="equipment-list-heading">Equipment</h2>
          <EquipmentList
            equipment={data.equipment}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
        <aside className="panel" aria-label="Selected equipment details">
          <EquipmentDetails
            equipmentItem={selectedEquipment}
            onCreateRequest={onCreateRequest}
          />
        </aside>
      </section>

      <section className="panel secondary-section" aria-labelledby="request-list-heading">
        <div className="panel-heading">
          <h2 id="request-list-heading">Demo Requests</h2>
          <span className="meta">{data.requests.length} total</span>
        </div>
        <RequestList requests={data.requests} equipment={data.equipment} />
      </section>
    </main>
  );
}
