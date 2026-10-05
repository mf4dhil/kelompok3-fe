import React from 'react';

export default function Testimonial() {
  const testimonials = [
    {
      name: 'Siti Aisyah',
      rating: '★★★★★',
      text: 'Kue untuk ulang tahun anak kemanusiaan best! Rasa enak dan tampilannya pesaing. Pesanannya lancar kok! Terima kasih SweetCake!',
      date: '2 Bulan lalu',
    },
    {
      name: 'Budi Santoso',
      rating: '★★★★★',
      text: 'Cocok untuk acara company outing. Kueannya murah meriah & kualitasnya bagus. Akan pesan lagi besok!',
      date: '1 Bulan lalu',
    },
    {
      name: 'Rina Wijaya',
      rating: '★★★★☆',
      text: 'Rasa legit dan pengirimannya tepat waktu. Hanya saja ukuran-ukurannya agak kecil mungkin perlu order size lebih besar lagi di kesempatan selanjutnya.',
      date: '3 Minggu lalu',
    },
  ];

  return (
    <section id="tentang" className="py-16 md:py-24 bg-secondary/5 text-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">Testimoni Pelanggan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 hover:border-tertiary/40 transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex text-tertiary">{item.rating}</div>
                <span className="text-sm text-primary/70 capitalize">{item.name}</span>
              </div>
              <p className="text-xs text-primary/60 line-clamp-3">{item.text}</p>
              <p className="text-xs text-primary/50 mt-2 capitalize">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}