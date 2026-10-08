# Perubahan Frontend (PreOrdersPage)

## Ringkasan
- **Opsi pembayaran DP / Full**: dropdown `payment_option` menggantikan input amount manual. DP otomatis mengambil 50 % total order, Full mengambil total penuh.
- **Bukti pembayaran hanya untuk transfer**: file input untuk upload bukti pembayaran kini **disembunyikan** ketika metode pembayaran dipilih `cash`.
- **Reset otomatis**: setelah mencatat pembayaran, UI melakukan refresh list order dan, bila detail modal terbuka, re‑fetch data order sehingga bukti foto dan status pembayaran terbaru langsung terlihat.
- **Form handling**: ketika metode berubah ke `cash`, nilai `proof_file` dan `proof_preview` di‑reset ke `null`/`''` sehingga tidak dikirim ke backend.
- **Pembaruan UI label**: tombol modal diubah menjadi "Catat Pembayaran" dan label‑label disesuaikan.
- **Penghapusan file foto pada reset DB**: script `seed/reset-db.js` kini menghapus seluruh file di `uploads/payments/` agar basis data bersih saat reset.

## Detail Perubahan File
| File | Perubahan |
|------|----------|
| `src/pages/PreOrdersPage.jsx` | • Tambah state `payment_option` (dp/full) dan kalkulasi amount otomatis.\n• Dropdown pilihan DP / Pelunasan.\n• Kondisional menampilkan input file hanya bila `payment_method !== 'cash'`.\n• Pada perubahan metode ke cash, nilai `proof_file` & `proof_preview` di‑reset.\n• Refresh list & detail order setelah pembayaran berhasil (refetch). |
| `seed/reset-db.js` | • Hapus semua file foto di folder `uploads/payments/` sebelum drop tabel. |
| `perubahan.md` (backend) | • Tambah catatan bahwa reset‑db kini membersihkan file foto. |

## Cara Uji
1. Jalankan `npm run dev` di frontend & backend.
2. Buka halaman **Pre‑Orders**.
3. Pilih sebuah order, klik **Bayar**.
4. Pilih metode **Cash** → tidak ada input file yang muncul.
5. Pilih metode **Transfer** → input file muncul, pilih gambar.
6. Pilih opsi **DP / Partial** atau **Pelunasan (Full)**, klik **Catat Pembayaran**.
7. Buka detail order → bukti foto (jika Transfer) dan `payment_status` (partial/paid) tampil.

---
*Dibuat pada 2026‑10‑08 oleh AI assistant.*