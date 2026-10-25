import { useEffect, useState } from 'react';
import SearchableSelect from '../../components/SearchableSelect.jsx';
import { canCreateDemoRequest, getAvailableUnitCount } from '../../utils/equipmentUtils.js';

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
  selectedEquipmentId,
  user,
}) {
  const [equipmentId, setEquipmentId] = useState(
    () => selectedEquipmentId || equipment[0]?.id || '',
  );
  const [studentName, setStudentName] = useState(() => user?.name || '');
  const [studentNim, setStudentNim] = useState('');
  const [studentProdi, setStudentProdi] = useState('');
  const [startDate, setStartDate] = useState(todayIso);
  const [endDate, setEndDate] = useState(todayIso);
  const [formError, setFormError] = useState('');

  // Sync with selected equipment when modal opens or selectedEquipmentId changes
  useEffect(() => {
    if (selectedEquipmentId) {
      setEquipmentId(selectedEquipmentId);
    } else if (equipment.length > 0 && !equipmentId) {
      setEquipmentId(equipment[0].id);
    }
  }, [selectedEquipmentId, equipment]);

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

  const currentEquipment = equipment.find((item) => item.id === equipmentId);
  const isAvailable = currentEquipment ? canCreateDemoRequest(currentEquipment) : false;
  const isPeriodValid = Boolean(startDate) && Boolean(endDate) && startDate <= endDate;

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

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
    if (!isAvailable) {
      setFormError('Peralatan yang dipilih saat ini tidak memiliki unit yang tersedia.');
      return;
    }

    onSubmit({
      equipmentId,
      studentName: studentName.trim(),
      studentNim: studentNim.trim(),
      studentProdi: studentProdi.trim(),
      startDate,
      endDate,
    });
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
            <span className="modal-badge">Formulir Peminjaman</span>
            <h2 id="modal-request-title">Ajukan Request Peminjaman Alat</h2>
            <p className="modal-subtitle">
              Lengkapi identitas mahasiswa dan jadwal peminjaman alat di bawah ini.
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
          {/* Section: Identitas Mahasiswa */}
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

            {/* Jurusan / Program Studi with Searchable Combobox */}
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

          {/* Section: Detail Peminjaman */}
          <div className="form-section">
            <h3 className="section-title">Detail Peralatan & Periode</h3>

            {/* Jenis Alat */}
            <div className="form-field">
              <label htmlFor="borrow-equipment">
                Alat yang Dipinjam <span className="req-star">*</span>
              </label>
              <div className="select-container">
                <select
                  id="borrow-equipment"
                  value={equipmentId}
                  onChange={(e) => setEquipmentId(e.target.value)}
                >
                  {equipment.map((item) => {
                    const avail = getAvailableUnitCount(item);
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.id}) — {avail} unit siap dipinjam
                      </option>
                    );
                  })}
                </select>
              </div>

              {!isAvailable && (
                <div className="field-warning">
                  ⚠️ Peralatan ini saat ini tidak memiliki unit yang tersedia untuk dipinjam.
                </div>
              )}
            </div>

            {/* Periode Peminjaman (Tanggal Mulai & Selesai) */}
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

          {/* Status Information Box */}
          <div className="modal-info-box">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="info-icon">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p>
              Setelah diajukan, status request otomatis menjadi{' '}
              <strong>WAITING APPROVAL</strong> dan akan diverifikasi oleh staf laboratorium.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button className="secondary-button" type="button" onClick={onClose}>
              Batal
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={!isAvailable || !isPeriodValid || !studentNim.trim() || !studentName.trim() || !studentProdi.trim()}
            >
              Ajukan Request Peminjaman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
