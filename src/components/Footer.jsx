import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary/30 bg-primary">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-quaternary">
            <span className="text-2xl" role="img" aria-label="kue">🍰</span>
            <span className="text-xl font-bold tracking-tight">NIFACake</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-quaternary/70">
            Pilih kue dan variannya dari katalog, pesan tanpa membuat akun, lalu ambil pesanan sesuai tanggal yang dipilih.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="mb-3 font-semibold text-quaternary">Jelajahi</h2>
          <ul className="space-y-2 text-sm text-quaternary/70">
            <li><Link to="/produk" className="transition hover:text-tertiary">Katalog kue</Link></li>
            <li><Link to="/#cara-po" className="transition hover:text-tertiary">Cara pemesanan</Link></li>
            <li><Link to="/#tentang" className="transition hover:text-tertiary">Tentang NIFACake</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-semibold text-quaternary">Pemesanan</h2>
          <p className="text-sm leading-6 text-quaternary/70">
            Pesanan saat ini menggunakan jadwal pengambilan. Informasi pembayaran dan nomor pesanan tersedia di struk setelah checkout.
          </p>
          <Link to="/produk" className="mt-4 inline-flex rounded-lg bg-tertiary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-tertiary/90">Mulai pesan</Link>
        </div>
      </div>
      <div className="border-t border-quaternary/10 py-4 text-center text-xs text-quaternary/50">
        © {currentYear} NIFACake.
      </div>
    </footer>
  );
}
