import { useMemo } from 'react';
import {
  canCreateDemoRequest,
  getAvailableUnitCount,
  getMaintenanceUnitCount,
} from '../../utils/equipmentUtils.js';

export default function EquipmentDetails({
  equipmentItem,
  allEquipment = [],
  cart = {},
  requests = [],
  period,
  onQuantityChange,
  onOpenBorrowModal,
}) {
  if (!equipmentItem) {
    return <div className="empty-state">Pilih peralatan untuk melihat rincian dan mengajukan peminjaman.</div>;
  }

  const canRequest = canCreateDemoRequest(equipmentItem, requests, period);
  const availableUnits = getAvailableUnitCount(equipmentItem, requests, period);
  const maintenanceUnits = getMaintenanceUnitCount(equipmentItem);
  const status = canRequest
    ? 'AVAILABLE'
    : maintenanceUnits > 0
      ? 'UNDER MAINTENANCE'
      : 'UNAVAILABLE';

  // Jumlah unit yang saat ini dipilih untuk barang yang sedang dibuka
  const currentItemQty = cart[equipmentItem.id] || 0;

  // List seluruh barang yang sudah dipilih dan jumlahnya
  const selectedItems = useMemo(() => {
    return allEquipment
      .filter((item) => (cart[item.id] || 0) > 0)
      .map((item) => ({
        item,
        qty: cart[item.id],
      }));
  }, [allEquipment, cart]);

  const totalSelectedUnits = useMemo(() => {
    return selectedItems.reduce((sum, entry) => sum + entry.qty, 0);
  }, [selectedItems]);

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

      {/* DI BAWAH BADGE: Pilih jumlah pinjaman (tampilan simple tanpa kotak-kotak) */}
      {canRequest ? (
        <div
          style={{
            margin: '8px 0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#344054' }}>
            Jumlah Pinjam:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#ffffff',
                border: '1px solid #d0d5dd',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => onQuantityChange(equipmentItem.id, Math.max(0, currentItemQty - 1))}
                disabled={currentItemQty <= 0}
                style={{
                  padding: '4px 10px',
                  background: currentItemQty <= 0 ? '#f8fafc' : '#ffffff',
                  border: 'none',
                  borderRight: '1px solid #e2e8f0',
                  color: currentItemQty <= 0 ? '#cbd5e1' : '#1d4ed8',
                  fontWeight: 700,
                  cursor: currentItemQty <= 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  lineHeight: 1,
                }}
                aria-label="Kurangi unit"
              >
                −
              </button>
              <span
                style={{
                  padding: '4px 12px',
                  minWidth: '28px',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#1e293b',
                  userSelect: 'none',
                }}
              >
                {currentItemQty}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (currentItemQty < availableUnits) {
                    onQuantityChange(equipmentItem.id, currentItemQty + 1);
                  }
                }}
                disabled={currentItemQty >= availableUnits}
                style={{
                  padding: '4px 10px',
                  background: currentItemQty >= availableUnits ? '#f8fafc' : '#ffffff',
                  border: 'none',
                  borderLeft: '1px solid #e2e8f0',
                  color: currentItemQty >= availableUnits ? '#cbd5e1' : '#1d4ed8',
                  fontWeight: 700,
                  cursor: currentItemQty >= availableUnits ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  lineHeight: 1,
                }}
                aria-label="Tambah unit"
              >
                +
              </button>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              / {availableUnits} unit
            </span>
          </div>
        </div>
      ) : (
        <p style={{ margin: '8px 0 14px', color: '#dc2626', fontSize: '0.82rem' }}>
          ⚠️ Tidak ada unit yang tersedia untuk dipinjam.
        </p>
      )}

      <dl className="details-list">
        <dt>Category</dt>
        <dd>{equipmentItem.category}</dd>
        <dt>Available units</dt>
        <dd>{availableUnits}</dd>
        <dt>Units under maintenance</dt>
        <dd>{maintenanceUnits}</dd>
      </dl>

      {/* DI ATAS TOMBOL: List barang yang sudah dipilih (tampilan simple biasa tanpa kotak) */}
      {selectedItems.length > 0 && (
        <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 600, color: '#475467' }}>
            Barang yang dipilih:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '4px' }}>
            {selectedItems.map(({ item, qty }) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: '#344054',
                  padding: '2px 0',
                }}
              >
                <span>• {item.name} ({item.id})</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{qty} unit</span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, 0)}
                    title="Hapus"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      padding: '0 2px',
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px',
              paddingTop: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#101828',
              borderTop: '1px dashed #e2e8f0',
            }}
          >
            <span>Total:</span>
            <span>{totalSelectedUnits} unit</span>
          </div>
        </div>
      )}

      {/* TOMBOL AJUKAN PINJAMAN */}
      <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
        <button
          className="primary-button"
          type="button"
          onClick={onOpenBorrowModal}
          disabled={totalSelectedUnits === 0}
          style={{ width: '100%', minHeight: '42px', fontSize: '0.95rem' }}
        >
          {totalSelectedUnits > 0
            ? `Ajukan Peminjaman (${totalSelectedUnits} Unit)`
            : 'Pilih Jumlah Unit Terlebih Dahulu'}
        </button>
      </div>
    </>
  );
}
