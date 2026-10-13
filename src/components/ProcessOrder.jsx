// import React from 'react';
import { Link } from 'react-router-dom';

export default function ProcessOrder() {
  return (
    <section id="cara-po" className="scroll-mt-20 py-16 md:py-24 border-b border-secondary/30 bg-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-12 tracking-tight">
          Cara Melakukan Pemesanan
        </h2>
        <p className="mx-auto -mt-7 mb-10 max-w-2xl text-center text-sm text-primary/70">
          Pesan kue langsung dari katalog tanpa perlu membuat akun.
        </p>
        <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">01</div>
            <h3 className="text-base font-semibold text-primary mb-2">Pilih Kue</h3>
            <p className="text-xs text-primary/70">Buka katalog, pilih kue, lalu tentukan bentuk, ukuran, dan rasa.</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">02</div>
            <h3 className="text-base font-semibold text-primary mb-2">Masukkan Keranjang</h3>
            <p className="text-xs text-primary/70">Periksa varian dan jumlah pesanan, lalu lanjutkan ke checkout.</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">03</div>
            <h3 className="text-base font-semibold text-primary mb-2">Isi Data Pemesan</h3>
            <p className="text-xs text-primary/70">Masukkan nama, nomor HP, dan tanggal pengambilan. Data customer lama terisi otomatis.</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">04</div>
            <h3 className="text-base font-semibold text-primary mb-2">Pilih Pembayaran</h3>
            <p className="text-xs text-primary/70">Pilih tunai atau transfer ke rekening yang tersedia, lalu buat pesanan.</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 sm:col-span-2 lg:col-span-1">
            <div className="text-3xl font-bold text-tertiary mb-3">05</div>
            <h3 className="text-base font-semibold text-primary mb-2">Simpan Struk</h3>
            <p className="text-xs text-primary/70">Cetak atau simpan struk dan catat nomor pesanan untuk pengambilan.</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/produk" className="inline-flex rounded-lg bg-tertiary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-tertiary/90">Mulai pilih kue</Link>
        </div>
      </div>
    </section>
  );
}
