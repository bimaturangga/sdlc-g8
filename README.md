# Campus Equipment Access & Borrowing (SDLC G8)

Aplikasi web sederhana untuk mengelola peminjaman peralatan kampus, dibangun sebagai latihan siklus pengembangan perangkat lunak (SDLC) kelompok 8. Mahasiswa dapat mengajukan peminjaman peralatan, sedangkan admin mengelola unit, status pemeliharaan, dan keputusan persetujuan.

Aplikasi berjalan sepenuhnya di sisi klien (React + Vite) dan menyimpan data demo di `localStorage` browser, sehingga tidak memerlukan backend.

## Fitur Utama

**Admin**
- Menambah unit individual untuk setiap peralatan.
- Menandai atau menghapus status pemeliharaan (*maintenance*) per unit.
- Melihat ketersediaan setiap unit berdasarkan nomor inventaris dan periode tanggal.
- Mendeteksi konflik jadwal pada pengajuan (tumpang tindih periode atau unit sedang dalam pemeliharaan).
- Menyetujui atau menolak pengajuan; keputusan langsung tampil sebagai kartu keputusan.
- Melihat detail mahasiswa pada unit yang telah dipesan.

**Mahasiswa**
- Menelusuri daftar peralatan beserta jumlah unit tersedia dan unit dalam pemeliharaan.
- Mengajukan peminjaman dengan memilih unit dan periode peminjaman.
- Memantau status pengajuan miliknya (diajukan, disetujui, ditolak).

**Umum**
- Login dengan akun demo berbasis peran (admin dan mahasiswa).
- Tombol **Reset Demo Data** untuk mengembalikan data ke kondisi awal.

## Anggota Kelompok & Pembagian Tugas

| Anggota | Task | Backlog | Deskripsi | Acceptance Criteria |
| --- | --- | --- | --- | --- |
| Bima Turangga Bayu P. | ST-01 | US5 | Daftar unit per nomor inventaris dan status per periode | AC5.1 |
| M. Aden Fikri Darmawan | ST-02 | US5 | Penanda maintenance (unit maintenance tidak dihitung tersedia) | AC5.2 |
| Deni Trio Saputra | ST-03 | US2 | Form request (jenis alat dan periode) | AC2.1 |
| Dahfi Ihza Alkahfi | ST-04 | US2 | Tampilan status request | AC2.2 |
| M. Hasbi Nurkhalish | ST-05 | US8 | Deteksi request yang periodenya beririsan pada unit yang sama | Constraint C6 |
| Muhammad Raihan | ST-06 | US8 | Penanda konflik yang tampil ke staf sebelum konfirmasi | Constraint C6 |

## Teknologi

| Komponen | Teknologi |
| --- | --- |
| UI | React 19 |
| Build tool | Vite 8 |
| Penyimpanan | Browser `localStorage` |

## Struktur Repositori

```
sdlc-g8/
└── apps/
    └── case-d-equipment-borrowing/
        ├── src/
        │   ├── auth/         # Login, sesi, dan akun demo
        │   ├── components/   # Komponen UI bersama
        │   ├── data/         # Data seed
        │   ├── features/     # equipment, requests, units
        │   ├── pages/        # Halaman admin dan student
        │   └── utils/        # Storage, ketersediaan unit, helper
        └── package.json
```

## Memulai

Prasyarat: Node.js versi LTS terbaru dan npm.

```bash
cd apps/case-d-equipment-borrowing
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite. Perintah lain:

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membuat build produksi di `dist/` |
| `npm run preview` | Pratinjau hasil build |

Dokumentasi lebih rinci tersedia di [README aplikasi](apps/case-d-equipment-borrowing/README.md).

## Alur Kolaborasi

1. Ambil item dari Sprint Backlog kelompok.
2. Buat branch khusus (contoh: `admin/st-01`, `student/st-03`).
3. Lakukan commit yang terfokus dengan pesan jelas (`feat:`, `fix:`, `chore:`).
4. Buka pull request dan minta peer review sebelum merge ke `main`.

## Batasan

Ini adalah demonstrasi sisi klien. Tidak ada backend, autentikasi sungguhan, basis data bersama, maupun sinkronisasi antarperangkat. Data hanya tersimpan di browser yang digunakan dan tidak boleh dipakai untuk informasi sensitif atau operasional.
