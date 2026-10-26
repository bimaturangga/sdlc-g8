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
  const [isRequestStatusOpen, setIsRequestStatusOpen] = useState(false);

  // State pilihan barang & jumlah unit: { [equipmentId]: quantity }
  const [cart, setCart] = useState({});

  const selectedEquipment =
    data.equipment.find((item) => item.id === selectedId) ?? null;
  const today = new Date().toISOString().slice(0, 10);
  const currentPeriod = { start: today, end: today };
  const studentRequests = data.requests.filter(
    (request) => request.studentId === user.id || (!request.studentId && request.studentName === user.name),
  );

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
        <>
          <div className="request-notification" role="status">
            <p>
              Permintaan peminjaman untuk <strong>{lastSubmittedCount} unit alat</strong> berhasil diajukan.
              Status saat ini: <strong>WAITING APPROVAL</strong>.
            </p>
            <button
              type="button"
              className="secondary-button notification-status-link"
              aria-expanded={isRequestStatusOpen}
              aria-controls="request-status"
              onClick={() => setIsRequestStatusOpen((isOpen) => !isOpen)}
            >
              {isRequestStatusOpen ? 'Sembunyikan Status Permintaan' : 'Lihat Status Permintaan'}
            </button>
          </div>
          {isRequestStatusOpen && (
            <section
              className="request-status-section"
              id="request-status"
              aria-labelledby="request-list-heading"
            >
              <div className="panel-heading">
                <div>
                  <h2 id="request-list-heading">Status Permintaan Saya</h2>
                  <p className="meta request-status-help">
                    Pantau keputusan admin untuk setiap permintaan peminjaman Anda.
                  </p>
                </div>
                <span className="meta">{studentRequests.length} total</span>
              </div>
              <RequestList requests={studentRequests} equipment={data.equipment} />
            </section>
          )}
        </>
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
            requests={data.requests}
            period={currentPeriod}
          />
        </section>

        <aside className="panel" aria-label="Selected equipment details">
          <EquipmentDetails
            equipmentItem={selectedEquipment}
            allEquipment={data.equipment}
            cart={cart}
            requests={data.requests}
            period={currentPeriod}
            onQuantityChange={handleQuantityChange}
            onOpenBorrowModal={handleOpenBorrowModal}
          />
        </aside>
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
