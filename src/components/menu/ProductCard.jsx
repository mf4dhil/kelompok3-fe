
import { Check, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1000);
  };

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
        <span className="text-lg font-bold text-secondary">
          {formatRupiah(product.price)}
        </span>

        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex items-center gap-1 rounded-lg bg-tertiary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-tertiary/90"
        >
          {added ? (
            <>
              <Check size={16} />
              Ditambahkan
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              + Tambah
            </>
          )}
        </button>
      </div>
    </div>
  );
}