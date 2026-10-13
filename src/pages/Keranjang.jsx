
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import NavbarHome from '../components/NavbarHome';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatRupiah';

export default function Keranjang() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-quaternary">
      <NavbarHome />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/produk"
            className="mb-5 inline-flex items-center gap-2 text-sm text-secondary hover:text-primary"
          >
            <ArrowLeft size={18} />
            Kembali pilih menu
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Keranjang Pesanan
          </h1>

          <p className="mt-2 text-primary/70">
            Periksa kembali kue pilihanmu sebelum melanjutkan pesanan.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Keranjang kosong */
          <div className="rounded-2xl border border-secondary/30 bg-white px-6 py-16 text-center">
            <ShoppingCart
              size={56}
              className="mx-auto mb-5 text-secondary/50"
            />

            <h2 className="mb-2 text-xl font-bold text-primary">
              Keranjangmu masih kosong
            </h2>

            <p className="mb-6 text-sm text-primary/60">
              Yuk, pilih kue favoritmu terlebih dahulu.
            </p>

            <Link
              to="/produk"
              className="inline-flex items-center rounded-lg bg-tertiary px-6 py-3 font-semibold text-primary transition hover:bg-tertiary/90"
            >
              Lihat Menu Kue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            {/* Daftar produk */}
            <section className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-secondary/30 bg-white p-4 sm:flex-row sm:items-center"
                >
                  {/* Gambar */}
                  <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary/10 sm:w-28">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🍰</span>
                    )}
                  </div>

                  {/* Detail produk */}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-primary">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-secondary">
                      {formatRupiah(item.price)}
                    </p>

                    <p className="mt-2 font-bold text-primary">
                      {formatRupiah(Number(item.price || 0) * item.quantity)}
                    </p>
                  </div>

                  {/* Kuantitas dan hapus */}
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Kurangi ${item.name}`}
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded-lg border border-secondary/30 p-2 text-primary hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-5 text-center font-semibold text-primary">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Tambah ${item.name}`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded-lg border border-secondary/30 p-2 text-primary hover:bg-secondary/10"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Ringkasan */}
            <aside className="rounded-xl border border-secondary/30 bg-white p-5 lg:sticky lg:top-24">
              <h2 className="mb-5 text-lg font-bold text-primary">
                Ringkasan Pesanan
              </h2>

              <div className="flex justify-between gap-3 text-sm text-primary/70">
                <span>Total item</span>
                <span>{totalItems} item</span>
              </div>

              <div className="my-4 border-t border-secondary/20" />

              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-primary">
                  Total harga
                </span>
                <span className="text-right text-xl font-bold text-secondary">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/#pesan')}
                className="mt-6 w-full rounded-lg bg-tertiary px-4 py-3 font-semibold text-primary transition hover:bg-tertiary/90"
              >
                Lanjut ke Form Pesanan
              </button>

              <p className="mt-3 text-center text-xs leading-relaxed text-primary/60">
                Periksa kembali jumlah dan pilihan kue sebelum melanjutkan.
              </p>

              <button
                type="button"
                onClick={() => navigate('/produk')}
                className="mt-3 w-full rounded-lg border border-secondary/30 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-secondary/10"
              >
                Tambah Kue Lain
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}