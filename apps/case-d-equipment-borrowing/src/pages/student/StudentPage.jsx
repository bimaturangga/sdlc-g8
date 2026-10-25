import { useState } from 'react';
import AppHeader from '../../components/AppHeader.jsx';
import EquipmentDetails from '../../features/equipment/EquipmentDetails.jsx';
import EquipmentList from '../../features/equipment/EquipmentList.jsx';
import BorrowRequestModal from '../../features/requests/BorrowRequestModal.jsx';
import RequestList from '../../features/requests/RequestList.jsx';

export default function StudentPage({ user, data, onCreateRequest, onLogout }) {
  const [selectedId, setSelectedId] = useState(() => data.equipment[0]?.id ?? null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSubmittedCount, setLastSubmittedCount] = useState(null);

  // State pilihan barang & jumlah unit: { [equipmentId]: quantity }
  const [cart, setCart] = useState({});

  const selectedEquipment =
    data.equipment.find((item) => item.id === selectedId) ?? null;

  function handleQuantityChange(equipmentId, nextQty) {
    setCart((prev) => {
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[equipmentId];
      } else {
        next[equipmentId] = nextQty;
      }
      return next;
    });
  }

  function handleClearCart() {
    setCart({});
  }

  function handleOpenBorrowModal() {
    setIsModalOpen(true);
  }

  function handleModalSubmit(payload) {
    onCreateRequest(payload);
    const count = Array.isArray(payload) ? payload.length : 1;
    setLastSubmittedCount(count);
  }

  return (
    <main className="app-shell">
      <AppHeader user={user} onLogout={onLogout} />

      <p className="browser-note">Demo data is saved in this browser only.</p>

      {lastSubmittedCount && (
        <div
          style={{
            padding: '14px 18px',
            marginBottom: '18px',
            borderRadius: '10px',
            background: '#ecfdf3',
            border: '1px solid #a6f4c5',
            color: '#027a48',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
          }}
        >
          <span>
            ✓ Permintaan peminjaman untuk <strong>{lastSubmittedCount} unit alat</strong> berhasil diajukan! Status tercatat:{' '}
            <strong>WAITING APPROVAL</strong>.
          </span>
          <button
            type="button"
            className="link-button"
            onClick={() => setLastSubmittedCount(null)}
            style={{ color: '#027a48', fontWeight: 700, cursor: 'pointer' }}
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
            allEquipment={data.equipment}
            cart={cart}
            onQuantityChange={handleQuantityChange}
            onOpenBorrowModal={handleOpenBorrowModal}
          />
        </aside>
      </section>

      <section className="panel secondary-section" aria-labelledby="request-list-heading" style={{ marginTop: '24px' }}>
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
        requests={data.requests}
        cart={cart}
        onClearCart={handleClearCart}
        user={user}
      />
    </main>
  );
}
