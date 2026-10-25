import { useEffect, useMemo, useState } from 'react';
import SearchableSelect from '../../components/SearchableSelect.jsx';
import {
  UNIT_STATUS,
  getUnitsWithStatus,
  isValidPeriod,
} from '../../utils/unitAvailability.js';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const JURUSAN_LIST = [
  'Akuntansi',
  'Artificial Intelligence (AI)',
  'Bisnis Digital',
  'Desain Komunikasi Visual (DKV)',
  'Ilmu Hukum',
  'Ilmu Komunikasi',
  'Ilmu Komputer / Computer Science',
  'Keuangan dan Investasi',
  'Manajemen',
  'Pendidikan Guru Sekolah Dasar (PGSD)',
  'Psikologi',
  'Sains Data (Data Science)',
  'Sistem Informasi',
  'Teknik Elektro',
  'Teknik Industri',
  'Teknik Lingkungan & Rekayasa Berkelanjutan',
  'Teknologi Pendidikan',
];

export default function BorrowRequestModal({
  isOpen,
  onClose,
  onSubmit,
  equipment = [],
  requests = [],
  cart = {},
  onClearCart,
  user,
}) {
  const [studentName, setStudentName] = useState(() => user?.name || '');
  const [studentNim, setStudentNim] = useState('');
  const [studentProdi, setStudentProdi] = useState('');
  const [startDate, setStartDate] = useState(todayIso);
  const [endDate, setEndDate] = useState(todayIso);
  const [formError, setFormError] = useState('');

  // Ambil daftar barang dan jumlah unit yang sudah dipilih di awal
  const selectedItems = useMemo(() => {
    return equipment
      .filter((item) => (cart[item.id] || 0) > 0)
      .map((item) => ({
        item,
        qty: cart[item.id],
      }));
  }, [equipment, cart]);

  const totalUnits = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.qty, 0);
  }, [selectedItems]);

  const period = { start: startDate, end: endDate };
  const isPeriodValid = Boolean(startDate) && Boolean(endDate) && startDate <= endDate;

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (totalUnits === 0) {
      setFormError('Belum ada alat yang dipilih.');
      return;
    }
    if (!studentName.trim()) {
      setFormError('Nama lengkap mahasiswa wajib diisi.');
      return;
    }
    if (!studentNim.trim()) {
      setFormError('NIM mahasiswa wajib diisi.');
      return;
    }
    if (!studentProdi.trim()) {
      setFormError('Jurusan / Program Studi wajib dipilih.');
      return;
    }
    if (!startDate || !endDate) {
      setFormError('Periode peminjaman wajib diisi.');
      return;
    }
    if (!isPeriodValid) {
      setFormError('Tanggal mulai tidak boleh melebihi tanggal selesai.');
      return;
    }

    // Alokasikan unit fisik yang tersedia untuk masing-masing barang yang dipilih di awal
    const payloads = [];

    for (const { item, qty } of selectedItems) {
      const uStatus = getUnitsWithStatus(item, requests, period);
      const avails = uStatus.filter((u) => u.status === UNIT_STATUS.AVAILABLE);

      if (avails.length < qty) {
        setFormError(
          `Peralatan "${item.name}" hanya memiliki ${avails.length} unit yang tersedia untuk periode ini (diminta: ${qty} unit). Silakan sesuaikan tanggal atau kurangi jumlah.`,
        );
        return;
      }

      for (let i = 0; i < qty; i++) {
        payloads.push({
          equipmentId: item.id,
          unitId: avails[i].unit.id,
          studentName: studentName.trim(),
          studentNim: studentNim.trim(),
          studentProdi: studentProdi.trim(),
          startDate,
          endDate,
        });
      }
    }

    onSubmit(payloads);
    if (onClearCart) onClearCart();
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-request-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-badge">Konfirmasi Peminjaman</span>
            <h2 id="modal-request-title">Ajukan Peminjaman ({totalUnits} Unit Alat)</h2>
            <p className="modal-subtitle">
              Lengkapi identitas mahasiswa dan jadwal peminjaman untuk alat yang telah dipilih.
            </p>
          </div>
          <button
            className="modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" width="20" height="20">
              <path d="M5 5L15 15M15 5L5 15" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="modal-error-alert" role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form-body">
          {/* Detail Alat yang Dipinjam (Simple list biasa, no boxes) */}
          <div className="form-section">
            <h3 className="section-title">Detail Alat yang Dipinjam</h3>

            {selectedItems.length === 0 ? (
              <p className="meta" style={{ color: '#dc2626' }}>
                Belum ada alat yang dipilih.
              </p>
            ) : (
              <div style={{ margin: '4px 0 0' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
                  {selectedItems.map(({ item, qty }) => (
                    <li
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.9rem',
                        color: '#344054',
                        padding: '4px 0',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <span>
                        • <strong>{item.name}</strong> <span className="meta" style={{ fontSize: '0.8rem' }}>({item.id})</span>
                      </span>
                      <span style={{ fontWeight: 600, color: '#1d4ed8' }}>
                        {qty} unit
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    paddingTop: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  <span>Total Unit:</span>
                  <span style={{ color: '#1d4ed8' }}>{totalUnits} unit</span>
                </div>
              </div>
            )}
          </div>

          {/* Identitas Mahasiswa (Nama, NIM, Jurusan) */}
          <div className="form-section">
            <h3 className="section-title">Identitas Mahasiswa</h3>

            <div className="form-grid-2col">
              <div className="form-field">
                <label htmlFor="student-name">
                  Nama Lengkap <span className="req-star">*</span>
                </label>
                <input
                  id="student-name"
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="student-nim">
                  NIM <span className="req-star">*</span>
                </label>
                <input
                  id="student-nim"
                  type="text"
                  required
                  placeholder="Contoh: 2210511045"
                  value={studentNim}
                  onChange={(e) => setStudentNim(e.target.value)}
                />
              </div>
            </div>

            {/* Jurusan / Program Studi */}
            <div className="form-field">
              <label htmlFor="student-prodi">
                Jurusan / Program Studi <span className="req-star">*</span>
              </label>
              <SearchableSelect
                id="student-prodi"
                options={JURUSAN_LIST}
                value={studentProdi}
                onChange={setStudentProdi}
                placeholder="Cari atau pilih jurusan Anda..."
                allowCustom={true}
              />
            </div>
          </div>

          {/* Tanggal Peminjaman (Mulai & Selesai) */}
          <div className="form-section">
            <h3 className="section-title">Tanggal Peminjaman</h3>

            <div className="form-grid-2col">
              <div className="form-field">
                <label htmlFor="start-date">
                  Tanggal Mulai <span className="req-star">*</span>
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  min={todayIso()}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value > endDate) {
                      setEndDate(e.target.value);
                    }
                  }}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="end-date">
                  Tanggal Selesai <span className="req-star">*</span>
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate || todayIso()}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isPeriodValid && (
              <span className="field-error">
                Tanggal selesai harus sama atau setelah tanggal mulai.
              </span>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button className="secondary-button" type="button" onClick={onClose}>
              Batal
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={
                totalUnits === 0 ||
                !isPeriodValid ||
                !studentNim.trim() ||
                !studentName.trim() ||
                !studentProdi.trim()
              }
            >
              Kirim Pengajuan Peminjaman ({totalUnits} Unit)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
