import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="py-16 md:py-24 border-b border-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary leading-tight">
                Homemade Cake <br />
                <span className="text-tertiary">for Your Special Moment</span>
              </h1>
              <p className="text-primary/70 text-lg sm:text-xl leading-relaxed mt-4">
                Kue dibuat fresh berdasarkan pesanan. <br />
                Pilih kue favoritmu dan tentukan tanggal pengambilan.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#pesan"
                className="px-6 py-3 text-base font-medium rounded-lg bg-primary text-tertiary hover:bg-primary/90 transition shadow-lg shadow-tertiary/20"
              >
                Pesan Sekarang
              </a>
              <a
                href="#menu"
                className="px-6 py-3 text-base font-medium rounded-lg border border-secondary/50 bg-secondary/10 text-primary hover:bg-secondary/20 transition"
              >
                Lihat Menu
              </a>
            </div>
          </div>

          {/* Image Placeholder / Showcase */}
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-4/3 rounded-2xl border border-dashed border-secondary/40 bg-secondary/10 flex flex-col items-center justify-center p-8 text-center shadow-inner group hover:border-tertiary/50 transition">
              <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">🎂</div>
              <span className="text-lg font-semibold text-primary/90 tracking-wider uppercase">Foto Cake</span>
              <p className="text-xs text-primary/50 mt-2">Special Custom & Signature Cakes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
