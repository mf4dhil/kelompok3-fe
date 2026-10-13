import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Printer } from 'lucide-react';
import NavbarHome from '../components/NavbarHome';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatRupiah';
import api from '../services/api';

const today = new Date().toLocaleDateString('en-CA');

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', pickup_date: '', payment_method: 'cash', rekening_id: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [submittedTotal, setSubmittedTotal] = useState(0);
  const [submittedItems, setSubmittedItems] = useState([]);
  const [rekenings, setRekenings] = useState([]);
  const [rekeningsLoading, setRekeningsLoading] = useState(true);
  const [rekeningsError, setRekeningsError] = useState('');
  const [existingCustomer, setExistingCustomer] = useState(null);
  const [customerLookup, setCustomerLookup] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/rekenings', { params: { is_active: true } })
      .then((response) => {
        if (active) setRekenings(Array.isArray(response.data) ? response.data : response.data?.data || []);
      })
      .catch((err) => {
        if (active) setRekeningsError(err.response?.data?.message || 'Daftar rekening belum bisa dimuat.');
      })
      .finally(() => { if (active) setRekeningsLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const phone = form.phone.trim();
    if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      setExistingCustomer(null);
      setCustomerLookup('');
      return undefined;
    }

    const controller = new AbortController();
    setCustomerLookup('checking');
    const timeout = setTimeout(async () => {
      try {
        const response = await api.get('/customers/lookup', { params: { phone }, signal: controller.signal });
        const customer = response.data?.data ?? null;
        setExistingCustomer(customer);
        setCustomerLookup(customer ? 'found' : 'not-found');
        if (customer) {
          setForm((current) => ({
            ...current,
            name: customer.name || current.name,
            email: customer.email || current.email,
            address: customer.address || current.address,
          }));
        }
      } catch (err) {
        if (!controller.signal.aborted) setCustomerLookup('error');
      }
    }, 450);

    return () => { clearTimeout(timeout); controller.abort(); };
  }, [form.phone]);

  const setField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === 'phone') setExistingCustomer(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!cartItems.length) return setError('Keranjang masih kosong.');
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) return setError('Masukkan nomor telepon yang valid (8–15 karakter).');
    setSubmitting(true);
    try {
      if (form.payment_method === 'transfer' && !form.rekening_id) {
        setError('Pilih rekening tujuan transfer.');
        return;
      }
      const customerPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim(),
      };
      const customerResponse = existingCustomer
        ? await api.patch(`/customers/${existingCustomer.id}`, customerPayload)
        : await api.post('/customers', customerPayload);
      const customer = customerResponse.data?.data ?? customerResponse.data?.customer ?? customerResponse.data;
      const response = await api.post('/orders', {
        customer_id: customer.id ?? customer.customer_id ?? existingCustomer?.id,
        pickup_date: form.pickup_date,
        payment_method: form.payment_method,
        ...(form.payment_method === 'transfer' ? { rekening_id: Number(form.rekening_id) } : {}),
        notes: form.notes.trim(),
        items: cartItems.map((item) => ({ product_variant_id: Number(item.variantId ?? item.id), quantity: item.quantity, notes: item.note || '' })),
      });
      const created = response.data?.data ?? response.data?.order ?? response.data;
      setOrder(created);
      setSubmittedTotal(totalPrice);
      setSubmittedItems(cartItems.map((item) => ({ ...item })));
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Pesanan belum dapat dibuat. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-quaternary text-primary'>
      <NavbarHome />
      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
        {order ? (
          <section id='print-receipt' className='mx-auto max-w-xl rounded-2xl border border-secondary/20 bg-white p-6 text-center shadow-sm sm:p-10'>
            <CheckCircle2 size={54} className='mx-auto text-green-600' />
            <p className='mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary'>NIFACake · Struk Pesanan</p>
            <h1 className='mt-2 text-3xl font-bold'>Pesanan diterima!</h1>
            <p className='mt-3 text-primary/70 no-print'>
              Terima kasih, {form.name}. Kami akan menghubungi {form.phone} untuk konfirmasi pesanan.
            </p>
            <div className='mt-6 rounded-xl border border-secondary/20 bg-white p-4 text-left text-sm sm:p-5'>
              <div className='flex justify-between gap-3 border-b border-secondary/20 pb-3'><strong>Nomor pesanan</strong><span className='font-semibold'>{order.order_number ?? order.id ?? '—'}</span></div>
              <div className='grid gap-x-5 gap-y-2 border-b border-secondary/20 py-3 sm:grid-cols-2'>
                <p><strong>Nama:</strong> {form.name}</p>
                <p><strong>Telepon:</strong> {form.phone}</p>
                {form.email && <p><strong>Email:</strong> {form.email}</p>}
                <p><strong>Tanggal pengambilan:</strong> {form.pickup_date}</p>
                {form.address && <p className='sm:col-span-2'><strong>Alamat/catatan lokasi:</strong> {form.address}</p>}
                {form.notes && <p className='sm:col-span-2'><strong>Catatan:</strong> {form.notes}</p>}
              </div>
              <h2 className='py-3 font-bold'>Rincian kue</h2>
              <div className='space-y-3 border-b border-secondary/20 pb-3'>
                {submittedItems.map((item) => <div key={item.variantId ?? item.id} className='flex justify-between gap-4'>
                  <div><p className='font-medium'>{item.name}</p><p className='text-xs text-primary/60'>{item.variantLabel || 'Varian'} · {item.quantity} × {formatRupiah(item.price)}</p></div>
                  <span className='shrink-0 font-medium'>{formatRupiah(Number(item.price || 0) * item.quantity)}</span>
                </div>)}
              </div>
              <div className='space-y-2 pt-3'>
                <p className='flex justify-between gap-3'><strong>Pembayaran</strong><span>{form.payment_method === 'cash' ? 'Tunai' : 'Transfer bank'}</span></p>
                {form.payment_method === 'transfer' && (() => { const account = rekenings.find((item) => String(item.id) === String(form.rekening_id)); return <p><strong>Rekening:</strong> {account?.bank_name} · {account?.account_number} a.n. {account?.account_name}</p>; })()}
                <p className='flex justify-between gap-3 border-t border-secondary/20 pt-3 text-base'><strong>Total pesanan</strong><strong>{formatRupiah(order.total_amount ?? submittedTotal)}</strong></p>
                <p className='text-xs text-primary/60'>Status: {order.status || 'Menunggu konfirmasi toko'}</p>
              </div>
            </div>
            <div className='no-print mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-900'>
              <strong>Simpan struk ini sebelum meninggalkan halaman.</strong>
              <p className='mt-1'>Pilih “Cetak / Simpan PDF” untuk menyimpan salinan, atau ambil screenshot. Simpan juga nomor pesanan agar mudah ditunjukkan saat pengambilan. Detail pesanan mungkin tidak dapat dibuka kembali setelah halaman ini ditutup.</p>
            </div>
            <button type='button' onClick={() => window.print()} className='no-print mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90'>
              <Printer size={18}/> Cetak / Simpan PDF
            </button>
            <Link to='/produk' className='no-print mt-3 inline-flex rounded-lg border border-secondary/30 px-5 py-3 font-semibold'>
              Lihat menu lainnya
            </Link>
          </section>
        ) : (
          <>
            <Link to='/keranjang' className='mb-5 inline-flex items-center gap-2 text-sm text-secondary'>
              <ArrowLeft size={18} /> Kembali ke keranjang
            </Link>
            <div className='mb-8'>
              <p className='text-sm font-semibold uppercase tracking-wide text-secondary'>Checkout tamu</p>
              <h1 className='mt-1 text-3xl font-bold'>Data pemesanan</h1>
              <p className='mt-2 text-primary/70'>Tidak perlu membuat akun. Isi kontak agar kami bisa mengonfirmasi pesanan.</p>
            </div>
            <form onSubmit={submit} className='grid items-start gap-8 lg:grid-cols-[1fr_380px]'>
              <section className='space-y-5 rounded-2xl border border-secondary/20 bg-white p-5 sm:p-7'>
                <h2 className='text-xl font-bold'>Informasi penerima</h2>
                <div>
                  <label className='mb-1 block text-sm font-medium' htmlFor='name'>
                    Nama penerima *
                  </label>
                  <input id='name' name='name' required maxLength='100' value={form.name} onChange={setField} autoComplete='name' className='w-full rounded-lg border border-secondary/30 p-3' placeholder='Nama lengkap' />
                </div>
                <div className='grid gap-5 sm:grid-cols-2'>
                  <div>
                    <label className='mb-1 block text-sm font-medium' htmlFor='phone'>
                      WhatsApp / telepon *
                    </label>
                    <input id='phone' name='phone' type='tel' required value={form.phone} onChange={setField} autoComplete='tel' className='w-full rounded-lg border border-secondary/30 p-3' placeholder='08xxxxxxxxxx' />
                    {customerLookup === 'checking' && <p className='mt-1 text-xs text-primary/50'>Memeriksa data customer…</p>}
                    {customerLookup === 'found' && existingCustomer && <p className='mt-1 text-xs text-green-700'>Data customer ditemukan dan sudah diisi otomatis. Silakan periksa kembali.</p>}
                    {customerLookup === 'not-found' && <p className='mt-1 text-xs text-primary/50'>Customer baru. Lengkapi data untuk melanjutkan.</p>}
                    {customerLookup === 'error' && <p className='mt-1 text-xs text-amber-700'>Data lama tidak dapat diperiksa. Anda tetap bisa melanjutkan.</p>}
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium' htmlFor='email'>
                      Email <span className='font-normal text-primary/50'>(opsional)</span>
                    </label>
                    <input id='email' name='email' type='email' maxLength='30' value={form.email} onChange={setField} autoComplete='email' className='w-full rounded-lg border border-secondary/30 p-3' placeholder='nama@email.com' />
                  </div>
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium' htmlFor='address'>
                    Alamat / catatan lokasi <span className='font-normal text-primary/50'>(opsional untuk pengambilan)</span>
                  </label>
                  <textarea
                    id='address'
                    name='address'
                    maxLength='100'
                    rows='2'
                    value={form.address}
                    onChange={setField}
                    autoComplete='street-address'
                    className='w-full rounded-lg border border-secondary/30 p-3'
                    placeholder='Alamat atau patokan lokasi'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium' htmlFor='pickup_date'>
                    Tanggal pengambilan *
                  </label>
                  <input id='pickup_date' name='pickup_date' type='date' required min={today} value={form.pickup_date} onChange={setField} className='w-full rounded-lg border border-secondary/30 p-3' />
                  <p className='mt-1 text-xs text-primary/60'>Jadwal pengantaran belum tersedia; pesanan diproses sebagai pengambilan.</p>
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium' htmlFor='payment_method'>
                    Metode pembayaran *
                  </label>
                  <select id='payment_method' name='payment_method' value={form.payment_method} onChange={setField} className='w-full rounded-lg border border-secondary/30 bg-white p-3'>
                    <option value='cash'>Tunai</option>
                    <option value='transfer' disabled={rekeningsLoading || rekenings.length === 0}>Transfer bank</option>
                  </select>
                </div>
                {form.payment_method === 'transfer' && <div>
                  <label className='mb-1 block text-sm font-medium' htmlFor='rekening_id'>Rekening tujuan *</label>
                  <select id='rekening_id' name='rekening_id' required value={form.rekening_id} onChange={setField} disabled={rekeningsLoading || rekenings.length === 0} className='w-full rounded-lg border border-secondary/30 bg-white p-3'>
                    <option value=''>{rekeningsLoading ? 'Memuat rekening…' : 'Pilih rekening tujuan'}</option>
                    {rekenings.map((rekening) => <option key={rekening.id} value={rekening.id}>{rekening.bank_name} · {rekening.account_number} · {rekening.account_name}</option>)}
                  </select>
                  {rekeningsError && <p role='alert' className='mt-1 text-xs text-red-600'>{rekeningsError}</p>}
                  {!rekeningsLoading && rekenings.length === 0 && <p className='mt-1 text-xs text-amber-700'>Belum ada rekening aktif. Pilih tunai atau hubungi toko.</p>}
                </div>}
                <div>
                  <label className='mb-1 block text-sm font-medium' htmlFor='notes'>
                    Catatan pesanan
                  </label>
                  <textarea id='notes' name='notes' rows='3' value={form.notes} onChange={setField} className='w-full rounded-lg border border-secondary/30 p-3' placeholder='Permintaan khusus (opsional)' />
                </div>
              </section>
              <aside className='rounded-2xl border border-secondary/20 bg-white p-5 lg:sticky lg:top-24'>
                <h2 className='text-lg font-bold'>Ringkasan pesanan</h2>
                <div className='mt-4 max-h-72 space-y-4 overflow-auto'>
                  {cartItems.map((item) => (
                    <div key={item.variantId ?? item.id} className='flex justify-between gap-4 text-sm'>
                      <div>
                        <p className='font-semibold'>{item.name}</p>
                        <p className='text-primary/60'>
                          {item.variantLabel || 'Kue'} × {item.quantity}
                        </p>
                      </div>
                      <span className='shrink-0'>{formatRupiah(Number(item.price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className='my-4 border-t border-secondary/20' />
                <div className='flex justify-between gap-3 font-bold'>
                  <span>Total</span>
                  <span className='text-secondary'>{formatRupiah(totalPrice)}</span>
                </div>
                {error && (
                  <p role='alert' className='mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
                    {error}
                  </p>
                )}
                <button type='submit' disabled={submitting || !cartItems.length} className='mt-6 w-full rounded-lg bg-tertiary px-4 py-3 font-semibold transition hover:bg-tertiary/90 disabled:cursor-not-allowed disabled:opacity-50'>
                  {submitting ? 'Mengirim pesanan…' : 'Buat pesanan'}
                </button>
                <p className='mt-3 text-center text-xs text-primary/60'>Total ditentukan server berdasarkan harga varian terbaru.</p>
              </aside>
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
