import { useState } from 'react';
import AppHeader from '../../components/AppHeader.jsx';
import EquipmentDetails from '../../features/equipment/EquipmentDetails.jsx';
import EquipmentList from '../../features/equipment/EquipmentList.jsx';
import BorrowRequestModal from '../../features/requests/BorrowRequestModal.jsx';
import RequestList from '../../features/requests/RequestList.jsx';

export default function StudentPage({ user, data, onCreateRequest, onLogout }) {
  const [selectedId, setSelectedId] = useState(() => data.equipment[0]?.id ?? null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEquipmentId, setModalEquipmentId] = useState(null);
  const [lastSubmittedId, setLastSubmittedId] = useState(null);

  const selectedEquipment =
    data.equipment.find((item) => item.id === selectedId) ?? null;

  function handleOpenBorrowModal(equipmentId) {
    setModalEquipmentId(equipmentId || selectedId);
    setIsModalOpen(true);
  }

  function handleModalSubmit(payload) {
    onCreateRequest(payload);
    setLastSubmittedId(payload.equipmentId);
  }

  return (
    <main className="app-shell">
      <AppHeader user={user} onLogout={onLogout} />

      <p className="browser-note">Demo data is saved in this browser only.</p>

      {lastSubmittedId && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '10px',
            background: '#ecfdf3',
            border: '1px solid #a6f4c5',
            color: '#027a48',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            ✓ Permintaan peminjaman berhasil diajukan! Status tercatat:{' '}
            <strong>WAITING APPROVAL</strong>.
          </span>
          <button
            type="button"
            className="link-button"
            onClick={() => setLastSubmittedId(null)}
            style={{ color: '#027a48', fontWeight: 600 }}
          >
            Tutup
          </button>
        </div>
      )}

      <section className="content-grid">
        <section className="panel" aria-labelledby="equipment-list-heading">
          <div className="panel-heading">
            <h2 id="equipment-list-heading">Equipment</h2>
          </div>
          <EquipmentList
            equipment={data.equipment}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
        <aside className="panel" aria-label="Selected equipment details">
          <EquipmentDetails
            equipmentItem={selectedEquipment}
            onOpenBorrowModal={handleOpenBorrowModal}
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

      <BorrowRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        equipment={data.equipment}
        selectedEquipmentId={modalEquipmentId || selectedId}
        user={user}
      />
    </main>
  );
}
