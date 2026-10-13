import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function PreOrder() {
  return (
    <section id="pesan" className="scroll-mt-20 border-b border-secondary/30 bg-secondary/5 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary/20 text-secondary">
          <ShoppingBag size={27} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">Siap memilih kue?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-primary/70 sm:text-base">
          Jelajahi katalog, pilih varian dan jumlahnya, lalu selesaikan pesanan tanpa perlu membuat akun.
        </p>
        <Link to="/produk" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-tertiary px-6 py-3 font-semibold text-primary transition hover:bg-tertiary/90">
          Buka katalog <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
