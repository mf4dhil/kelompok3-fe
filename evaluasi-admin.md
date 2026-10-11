# Evaluasi dan Planning Pengembangan Halaman Admin

## Kondisi Saat Ini

Halaman admin sudah mendukung operasional dasar toko: dashboard, pesanan, produk, pembayaran, laporan, bahan baku, pembelian, pengeluaran, master data, dan pengaturan resep. Pengembangan berikutnya perlu berfokus pada akurasi stok, keamanan akses, dan kejelasan pekerjaan harian admin.

## Sasaran

1. Melindungi aksi administratif dari akses tanpa otorisasi.
2. Menjaga stok tetap akurat ketika pesanan dibuat, dibatalkan, atau dihapus.
3. Mencegah pemesanan varian yang bahan resepnya tidak tersedia.
4. Memastikan setiap varian yang dijual memiliki resep yang tercatat.
5. Menyediakan jejak audit untuk verifikasi pembayaran.
6. Mempercepat admin melihat pekerjaan yang perlu segera ditangani.

## Tahapan Pengerjaan

### Tahap 1 — Keamanan Endpoint Administratif

**Prioritas:** P0 — dikerjakan pertama.

**Cakupan:**

- Tinjau seluruh endpoint pesanan dan pembayaran.
- Wajibkan autentikasi dan role admin pada perubahan status, pengubahan data, serta penghapusan pesanan.
- Lindungi aksi verifikasi, penolakan, perubahan, dan penghapusan pembayaran.
- Pertahankan endpoint yang memang diperlukan pelanggan untuk membuat pesanan atau mengirim bukti pembayaran, dengan validasi input dan akses yang sesuai.
- Periksa juga endpoint produk, material, resep, pembelian, pengeluaran, dan master data agar semua mutasi administratif terlindungi.

**Kriteria selesai:**

- Request tanpa token atau dengan role yang tidak sesuai ditolak.
- Admin tetap dapat menggunakan semua aksi yang berhak diaksesnya.
- Aksi publik yang diperlukan pelanggan tetap berjalan dengan batas akses yang tepat.

### Tahap 2 — Pembatalan Pesanan dan Pengembalian Stok

**Prioritas:** P0 — dikerjakan sebelum fitur ketersediaan otomatis.

**Cakupan:**

- Definisikan aturan kapan pesanan boleh dibatalkan dan dihapus.
- Ketika pesanan yang stok bahannya sudah terpakai dibatalkan, kembalikan jumlah bahan berdasarkan resep dan item pesanan.
- Catat pengembalian sebagai transaksi stok yang merujuk pada pesanan.
- Pastikan pembatalan atau penghapusan berulang tidak mengembalikan stok lebih dari sekali.
- Bungkus perubahan status pesanan, stok, dan transaksi stok dalam satu transaksi database.
- Tinjau kebijakan refund pembayaran secara terpisah; pengembalian stok tidak otomatis berarti pembayaran sudah dikembalikan.

**Kriteria selesai:**

- Stok kembali tepat satu kali saat pesanan dibatalkan.
- Riwayat stok menunjukkan pemakaian dan pengembalian dengan referensi pesanan.
- Jika salah satu langkah gagal, seluruh perubahan dibatalkan.

### Tahap 3 — Ketersediaan Varian Berdasarkan Stok Bahan

**Prioritas:** P1.

**Cakupan:**

- Hitung kemampuan produksi setiap varian berdasarkan stok bahan dan takaran pada resep.
- Tandai varian tidak tersedia jika ada bahan yang tidak mencukupi untuk satu porsi.
- Cegah varian tidak tersedia dipilih pada proses pemesanan baru dan validasi ulang di backend saat order disimpan.
- Sediakan daftar alasan, misalnya nama bahan dan jumlah kekurangannya.
- Pengaktifan kembali dilakukan manual oleh admin setelah stok cukup; sistem tidak mengaktifkan produk otomatis.
- Tentukan perilaku pesanan yang sudah tercatat ketika stok kemudian habis: pesanan tersebut tetap dipertahankan, sementara pesanan baru dicegah.

**Kriteria selesai:**

- Admin dapat melihat varian yang tersedia/tidak tersedia beserta penyebabnya.
- Varian tidak tersedia tidak dapat dipesan melalui frontend maupun request API langsung.
- Setelah stok cukup, admin dapat mengaktifkan varian secara manual.

### Tahap 4 — Kelengkapan Resep dan Kesiapan Produksi

**Prioritas:** P1.

**Cakupan:**

- Tambahkan ringkasan jumlah varian aktif yang sudah dan belum memiliki resep.
- Beri peringatan pada dashboard atau halaman produk untuk varian aktif tanpa resep.
- Tambahkan filter resep: lengkap, belum diatur, atau menggunakan bahan nonaktif.
- Beri konfirmasi yang jelas saat menyimpan resep kosong untuk varian yang masih aktif.
- Tampilkan satuan dasar bahan secara konsisten pada formulir resep dan riwayat pemakaian.

**Kriteria selesai:**

- Admin dapat menemukan seluruh varian aktif tanpa resep.
- Status kesiapan resep tidak hanya terlihat setelah membuka setiap varian.
- Tidak ada varian yang dianggap tercatat stoknya jika resep belum diatur.

### Tahap 5 — Audit Verifikasi Pembayaran

**Prioritas:** P1.

**Cakupan:**

- Simpan admin yang memverifikasi atau menolak pembayaran.
- Simpan waktu perubahan status dan alasan penolakan.
- Tampilkan riwayat status pada detail pembayaran dan detail pesanan.
- Pastikan perubahan pembayaran dan pembaruan status pembayaran pesanan konsisten serta transaksional.

**Kriteria selesai:**

- Setiap verifikasi/penolakan memiliki pelaku dan waktu yang dapat ditelusuri.
- Pembayaran yang ditolak menampilkan alasan kepada admin.
- Ringkasan pembayaran pesanan sesuai dengan pembayaran yang sudah diverifikasi.

### Tahap 6 — Dashboard sebagai Pusat Tindakan Harian

**Prioritas:** P2.

**Cakupan:**

- Tambahkan jumlah pembayaran yang menunggu verifikasi.
- Tampilkan pesanan yang segera diambil dan pesanan yang terlambat diproses.
- Tampilkan daftar bahan yang perlu dibeli dan jumlah yang disarankan berdasarkan minimum stok.
- Tambahkan tren ringkas penjualan dan pengeluaran dengan rentang waktu yang jelas.
- Hubungkan setiap indikator ke halaman terkait dengan filter yang sudah diterapkan.
- Tampilkan waktu pembaruan data dan kondisi gagal memuat dengan aksi coba lagi.

**Kriteria selesai:**

- Admin dapat mengenali pekerjaan paling mendesak tanpa membuka beberapa halaman.
- Setiap angka memiliki definisi dan periode yang jelas.
- Tautan dari indikator membawa admin langsung ke daftar tindakan terkait.

### Tahap 7 — Halaman dan Alur Manajemen Pelanggan

**Prioritas:** P2.

**Cakupan:**

- Tambahkan halaman daftar pelanggan dengan pencarian berdasarkan nama, nomor telepon, atau email.
- Tampilkan ringkasan jumlah pesanan dan nilai transaksi per pelanggan.
- Sediakan detail histori pesanan pelanggan.
- Tentukan kebijakan edit/nonaktif pelanggan dan lindungi data pribadi berdasarkan role.

**Kriteria selesai:**

- Admin dapat menemukan pelanggan dan melihat riwayat interaksi tanpa mencari manual di seluruh pesanan.
- Data pelanggan tetap konsisten dengan data pesanan yang sudah tersimpan.

## Pekerjaan Lintas Tahap

- Samakan label status, format tanggal, mata uang, dan istilah pada seluruh halaman admin.
- Pastikan halaman daftar memiliki loading, error, empty state, pencarian/filter, dan pagination yang informatif.
- Tinjau responsif untuk tabel, dialog, dan formulir pada layar kecil.
- Gunakan konfirmasi untuk aksi destruktif dan tampilkan pesan hasil yang menjelaskan akibat aksi.
- Tambahkan pengujian untuk aturan stok, pembatalan, akses role, transisi status, dan konsistensi pembayaran sebelum rilis.

## Urutan Rilis yang Disarankan

1. Keamanan endpoint administratif.
2. Pengembalian stok saat pesanan dibatalkan/dihapus.
3. Cakupan resep dan kesiapan data varian.
4. Ketersediaan varian berdasarkan stok dengan aktivasi manual.
5. Audit verifikasi pembayaran.
6. Penyempurnaan dashboard.
7. Manajemen pelanggan.

Urutan ini menangani risiko keamanan dan ketidakakuratan stok terlebih dahulu, sebelum menambahkan indikator dan fitur administrasi baru.
