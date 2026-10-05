import React, { useState } from 'react';

export default function PreOrder() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cakeType: 'Signature Classic',
    date: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert(`Terima kasih ${formData.name}! Pesanannya berhasil. Kami akan menghubungi ${formData.phone} untuk konfirmasi detail pesanan ${formData.cakeType} pada tanggal ${formData.date}.`);
    setFormData({
      name: '',
      phone: '',
      cakeType: 'Signature Classic',
      date: '',
      message: '',
    });
  };

  return (
    <section id="pesan" className="py-16 md:py-24 border-b border-secondary/30 bg-secondary/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6 tracking-tight">
            Pesan Kue Segera
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-primary/70 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-secondary/10 border border-secondary/30 rounded-lg py-3 px-4 text-primary placeholder-secondary/40 focus:outline-none focus:border-tertiary transition"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary/70 mb-2">
                Nomor HP
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-secondary/10 border border-secondary/30 rounded-lg py-3 px-4 text-primary placeholder-secondary/40 focus:outline-none focus:border-tertiary transition"
                placeholder="Masukkan nomor HP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary/70 mb-2">
                Tipe Kue
              </label>
              <select
                name="cakeType"
                value={formData.cakeType}
                onChange={handleChange}
                required
                className="w-full bg-secondary/10 border border-secondary/30 rounded-lg py-3 px-4 text-primary placeholder-secondary/40 focus:outline-none focus:border-tertiary transition appearance-none"
              >
                <option value="Signature Classic">Signature Classic - Rp 89.000</option>
                <option value="Rainbow Fondant">Rainbow Fondant - Rp 125.000</option>
                <option value="Kue Apel">Kue Apel - Rp 65.000</option>
                <option value="Oreo Cream">Oreo Cream - Rp 72.000</option>
                <option value="Chocolate Hazelnut">Chocolate Hazelnut - Rp 95.000</option>
                <option value="Red Velvet">Red Velvet - Rp 88.000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary/70 mb-2">
                Tanggal Kebutuhan
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-secondary/10 border border-secondary/30 rounded-lg py-3 px-4 text-primary placeholder-secondary/40 focus:outline-none focus:border-tertiary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary/70 mb-2">
                Pesan Khusus (Opsional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full bg-secondary/10 border border-secondary/30 rounded-lg py-3 px-4 text-primary placeholder-secondary/40 focus:outline-none focus:border-tertiary transition resize-none"
                placeholder="Catatan khusus untuk kue..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 text-base font-medium rounded-lg bg-tertiary text-primary hover:bg-tertiary/90 transition shadow-lg shadow-tertiary/20"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}