import React from 'react';

export default function WhyChoose() {
  const features = [
    {
      title: 'Fresh Made',
      description: 'Dibuat langsung saat pesanan masuk',
      icon: '🍰',
    },
    {
      title: 'Pilih Varian',
      description: 'Tentukan bentuk, ukuran, dan rasa dari varian yang tersedia',
      icon: '📦',
    },
    {
      title: 'Pengambilan Terjadwal',
      description: 'Pilih tanggal pengambilan saat checkout agar pesanan siap sesuai jadwal',
      icon: '📅',
    },
  ];

  return (
    <section id="tentang" className="scroll-mt-20 py-16 border-b border-secondary/30 bg-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-12 tracking-tight">
          Kenapa Pilih Kami?
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 text-center hover:border-tertiary/60 transition shadow-sm"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-primary/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
