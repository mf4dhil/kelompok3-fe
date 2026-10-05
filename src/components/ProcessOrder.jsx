import React from 'react';

export default function ProcessOrder() {
  return (
    <section id="cara-po" className="py-16 md:py-24 border-b border-secondary/30 bg-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-12 tracking-tight">
          Cara Melakukan Pre-Order
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">01</div>
            <h3 className="text-base font-semibold text-primary mb-2">Pilih Cake</h3>
            <p className="text-xs text-primary/70">Pilih kue favoritmu di menu</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">02</div>
            <h3 className="text-base font-semibold text-primary mb-2">Tentukan Tanggal</h3>
            <p className="text-xs text-primary/70">Pilih tanggal pengambilan kue</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">03</div>
            <h3 className="text-base font-semibold text-primary mb-2">Isi Data</h3>
            <p className="text-xs text-primary/70">Lengkapi data nama & kontak</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-tertiary mb-3">04</div>
            <h3 className="text-base font-semibold text-primary mb-2">Konfirmasi</h3>
            <p className="text-xs text-primary/70">Kirim pesanan & tunggu konfirmasi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
