# Campus Equipment Access & Borrowing

Aplikasi peminjaman peralatan kampus berbasis React dan Vite untuk latihan SDLC. Mendukung dua peran, admin dan mahasiswa, dengan data demo yang tersimpan di browser.

## Prasyarat

- Node.js LTS terbaru
- npm

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite. Jalankan `npm run build` untuk membuat build produksi di `dist/` dan `npm run preview` untuk pratinjaunya.

## Akun Demo

| Peran | Nama |
| --- | --- |
| Admin | Admin Demo |
| Mahasiswa | Student Demo |

Akun didefinisikan di `src/auth/users.js`. Login ini hanya untuk demonstrasi dan bukan autentikasi sungguhan.

## Fitur

### Admin
- Menambah unit individual pada peralatan.
- Menandai atau menghapus status pemeliharaan per unit; unit dalam pemeliharaan tidak dapat dipinjam.
- Melihat daftar ketersediaan unit per nomor inventaris dan periode (tersedia, dipesan, pemeliharaan).
- Melihat hasil pengecekan konflik jadwal pada setiap pengajuan.
- Menyetujui atau menolak pengajuan berstatus menunggu keputusan; hasilnya langsung tampil sebagai kartu keputusan.
- Membuka kartu unit yang dipesan untuk melihat data mahasiswa peminjam (nama, NIM, program studi).

### Mahasiswa
- Melihat enam peralatan seed, detailnya, dan jumlah unit tersedia serta dalam pemeliharaan.
- Mengajukan peminjaman dengan memilih unit dan periode, selama peralatan memiliki unit tersedia.
- Melihat status pengajuan yang terkait dengan akunnya.

### Umum
- Total peralatan dan jumlah yang masih memiliki unit tersedia.
- Tombol aksi dinonaktifkan jika tidak ada unit tersedia.
- **Reset Demo Data** untuk memulihkan data seed.

## Aturan Ketersediaan

Logika berada di `src/utils/unitAvailability.js`:

- Status unit: `AVAILABLE`, `RESERVED`, atau `MAINTENANCE`.
- Periode valid jika tanggal mulai dan selesai terisi dan mulai ≤ selesai.
- Dua pengajuan pada unit yang sama dianggap konflik jika periodenya tumpang tindih.
- Pengajuan berstatus `REJECTED`, `CANCELLED`, atau `RETURNED` diabaikan dalam pengecekan konflik.
- Unit yang ditandai pemeliharaan selalu dianggap konflik.

## Data & Reset

Data seed berasal dari `src/data/seed.js`. Perubahan (termasuk unit dan penanda pemeliharaan) disimpan sebagai JSON pada kunci `sdlc:case-d:v1` di `localStorage`. Data demo lama dengan format pemeliharaan per peralatan dimigrasikan otomatis saat dimuat. Data tidak dibagikan antarbrowser atau perangkat dan tidak ditulis kembali ke Git.

## Struktur Proyek

```
src/
├── App.jsx                # State utama dan koneksi aksi UI
├── main.jsx               # Entry point
├── styles.css             # Gaya responsif
├── auth/                  # LoginPage, session, users
├── components/            # AppHeader, ResetControl, SearchableSelect, StatusBadge
├── data/seed.js           # Data demo deterministik
├── features/
│   ├── equipment/         # EquipmentCard, EquipmentDetails, EquipmentList
│   ├── requests/          # BorrowRequestModal, RequestList
│   └── units/             # UnitFilterPanel
├── pages/
│   ├── admin/AdminPage.jsx
│   └── student/StudentPage.jsx
└── utils/                 # equipmentUtils, storage, unitAvailability
```

## Alur Kolaborasi

Kerjakan item dari Sprint Backlog kelompok Anda: gunakan branch khusus, buat commit yang terfokus, buka pull request, dan minta peer review sebelum merge. Hubungkan perubahan kode dan bukti review dengan item backlog yang dipilih.

## Batasan

Aplikasi ini hanya demonstrasi sisi klien. Tidak ada backend, autentikasi sungguhan, basis data bersama, atau sinkronisasi lintas perangkat. Jangan gunakan untuk data sensitif atau operasional.
