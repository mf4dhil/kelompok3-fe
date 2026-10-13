
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import api from "../services/api";

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedProduct = location.state;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alamat: "",
    pickup_date: "",
    payment_method: "cash",
    rekening_id: "",
    quantity: "1",
    item_notes: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const unitPrice = Number(selectedProduct?.variant?.price || 0);
  const quantity = Number(form.quantity || 0);
  const total = unitPrice * quantity;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedProduct?.variantId) {
      setError("Produk atau varian belum dipilih.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.alamat.trim()
    ) {
      setError("Lengkapi nama, email, nomor telepon, dan alamat.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Format email tidak valid.");
      return;
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) {
      setError("Nomor telepon harus berisi 8–15 karakter angka.");
      return;
    }

    if (!form.pickup_date || form.pickup_date < getToday()) {
      setError("Tanggal pengambilan tidak boleh sebelum hari ini.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Jumlah pesanan minimal 1.");
      return;
    }

    if (
      form.payment_method === "transfer" &&
      !form.rekening_id
    ) {
      setError("Masukkan ID rekening tujuan.");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Simpan customer.
      const customerResponse = await api.post("/customers", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        alamat: form.alamat.trim(),
      });

      const customerData =
        customerResponse.data.customer ??
        customerResponse.data.data ??
        customerResponse.data;

      const customerId =
        customerData.id ?? customerData.customer_id;

      if (!customerId) {
        throw new Error(
          "ID customer tidak ditemukan pada response API."
        );
      }

      // 2. Buat transaksi pesanan.
      const orderPayload = {
        customer_id: customerId,
        pickup_date: form.pickup_date,
        payment_method: form.payment_method,
        ...(form.payment_method === "transfer"
          ? { rekening_id: Number(form.rekening_id) }
          : {}),
        notes: form.notes.trim(),
        items: [
          {
            product_variant_id: Number(selectedProduct.variantId),
            quantity,
            note: form.item_notes.trim(),
          },
        ],
      };

      const orderResponse = await api.post("/orders", orderPayload);

      setOrderResult(orderResponse.data);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal menyimpan pesanan. Periksa endpoint API."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedProduct?.variantId) {
    return (
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-xl rounded-xl border border-secondary/30 bg-secondary/10 p-8 text-center">
          <ShoppingBag className="mx-auto text-tertiary" size={48} />

          <h1 className="mt-4 text-xl font-bold text-primary">
            Produk belum dipilih
          </h1>

          <p className="mt-2 text-primary/70">
            Silakan pilih produk dan variannya terlebih dahulu.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-tertiary/20 px-5 py-3 font-semibold text-tertiary transition hover:bg-tertiary hover:text-white"
          >
            Kembali ke Beranda
          </button>
        </div>
      </main>
    );
  }

  if (success) {
    const orderId =
      orderResult?.order?.id ??
      orderResult?.data?.id ??
      orderResult?.id;

    return (
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-xl rounded-xl border border-secondary/30 bg-secondary/10 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/20 text-3xl font-bold text-tertiary">
            ✓
          </div>

          <h1 className="mt-4 text-2xl font-bold text-primary">
            Pesanan Berhasil Dibuat!
          </h1>

          <p className="mt-3 text-primary/70">
            Terima kasih, {form.name}. Pesanan kamu telah dikirim ke server.
          </p>

          {orderId && (
            <p className="mt-2 text-sm text-primary/70">
              Nomor referensi: {orderId}
            </p>
          )}

          <div className="mt-6 rounded-xl border border-secondary/30 bg-white p-4 text-left">
            <p className="font-semibold text-primary">
              {selectedProduct.productName}
            </p>

            <p className="mt-1 text-sm text-primary/70">
              {selectedProduct.variant.shape} /{" "}
              {selectedProduct.variant.size} /{" "}
              {selectedProduct.variant.flavor}
            </p>

            <p className="mt-1 text-sm text-primary/70">
              Jumlah: {quantity}
            </p>

            <p className="mt-2 text-lg font-bold text-tertiary">
              {formatPrice(total)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full rounded-lg bg-tertiary/20 px-5 py-3 font-semibold text-tertiary transition hover:bg-tertiary hover:text-white"
          >
            Kembali ke Beranda
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen border-b border-secondary/30 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-primary/70 transition hover:text-tertiary"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Form Pemesanan Kue
          </h1>

          <p className="mt-2 text-primary/70">
            Isi data diri dan detail pesanan kamu.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-3"
        >
          <section className="space-y-5 rounded-xl border border-secondary/30 bg-secondary/10 p-5 sm:p-8 lg:col-span-2">
            <h2 className="text-xl font-bold text-primary">
              Data Customer
            </h2>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-primary">
                Nama lengkap *
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-primary">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-primary">
                Nomor telepon *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label htmlFor="alamat" className="mb-2 block text-sm font-medium text-primary">
                Alamat *
              </label>
              <textarea
                id="alamat"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <div>
              <label htmlFor="pickup_date" className="mb-2 block text-sm font-medium text-primary">
                Tanggal pengambilan *
              </label>
              <input
                id="pickup_date"
                name="pickup_date"
                type="date"
                min={getToday()}
                value={form.pickup_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-primary">
                Jumlah kue *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
              />
            </div>

            <div>
              <label htmlFor="item_notes" className="mb-2 block text-sm font-medium text-primary">
                Catatan untuk kue
              </label>
              <textarea
                id="item_notes"
                name="item_notes"
                value={form.item_notes}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
                placeholder="Contoh: tulisan selamat ulang tahun"
              />
            </div>

            <div>
              <label htmlFor="notes" className="mb-2 block text-sm font-medium text-primary">
                Catatan pesanan
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
                placeholder="Catatan tambahan (opsional)"
              />
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-secondary/30 bg-secondary/10 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-primary">
              Ringkasan Pesanan
            </h2>

            <div className="mt-5 flex items-start gap-3">
              <div className="rounded-lg bg-tertiary/20 p-3 text-tertiary">
                <ShoppingBag size={24} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-primary">
                  {selectedProduct.productName}
                </p>

                <p className="mt-1 text-sm text-primary/70">
                  {selectedProduct.variant.shape} /{" "}
                  {selectedProduct.variant.size} /{" "}
                  {selectedProduct.variant.flavor}
                </p>

                <p className="mt-2 font-semibold text-tertiary">
                  {formatPrice(unitPrice)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="payment_method" className="mb-2 block text-sm font-medium text-primary">
                Metode pembayaran *
              </label>

              <select
                id="payment_method"
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
              >
                <option value="cash">Tunai</option>
                <option value="transfer">Transfer bank</option>
              </select>
            </div>

            {form.payment_method === "transfer" && (
              <div className="mt-4">
                <label htmlFor="rekening_id" className="mb-2 block text-sm font-medium text-primary">
                  ID rekening tujuan *
                </label>

                <input
                  id="rekening_id"
                  name="rekening_id"
                  type="number"
                  min="1"
                  value={form.rekening_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
                  placeholder="Masukkan ID rekening"
                />

                <p className="mt-1 text-xs text-primary/70">
                  Gunakan ID rekening yang terdaftar di database.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3 border-t border-secondary/30 pt-4">
              <div className="flex justify-between gap-3 text-sm text-primary/70">
                <span>Harga satuan</span>
                <span>{formatPrice(unitPrice)}</span>
              </div>

              <div className="flex justify-between gap-3 text-sm text-primary/70">
                <span>Jumlah</span>
                <span>{form.quantity || 0}</span>
              </div>

              <div className="flex justify-between gap-3 border-t border-secondary/30 pt-3 text-lg font-bold text-primary">
                <span>Total</span>
                <span className="text-right text-tertiary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-tertiary/20 px-5 py-3 font-semibold text-tertiary transition hover:bg-tertiary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Menyimpan Pesanan..." : "Buat Pesanan"}
            </button>

            <p className="mt-3 text-xs leading-5 text-primary/70">
              Pastikan semua data sudah benar sebelum membuat pesanan.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
