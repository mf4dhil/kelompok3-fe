
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../../utils/formatRupiah.js';

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-secondary/30 bg-secondary/10 transition duration-300 hover:-translate-y-1 hover:border-tertiary/50 hover:shadow-lg">
      <div>
        {/* Gambar produk */}
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-secondary/20">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <span className="text-5xl">
              {product.type === 'signature' ? '👑' : '🍰'}
            </span>
          )}
        </div>

        {/* Informasi produk */}
        <div className="p-4">
          <h3 className="mb-1 text-lg font-semibold text-primary">
            {product.name}
          </h3>

          <p className="line-clamp-2 text-sm text-primary/70">
            {product.description}
          </p>
        </div>
      </div>

      {/* Harga dan tombol keranjang */}
      <div className="flex items-center justify-between gap-2 border-t border-secondary/30 p-4">
        <span className="text-sm font-bold text-secondary sm:text-base">
          {product.priceRange
            ? product.priceRange.min === product.priceRange.max
              ? formatRupiah(product.priceRange.min)
              : `${formatRupiah(product.priceRange.min)} – ${formatRupiah(product.priceRange.max)}`
            : 'Harga belum tersedia'}
        </span>

        <Link to={`/products/${product.id}`} className="inline-flex items-center gap-1 rounded-lg bg-tertiary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-tertiary/90">
          Pilih varian <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
