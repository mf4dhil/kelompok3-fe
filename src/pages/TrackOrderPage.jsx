import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CakeSlice, Check, CheckCircle2, Clock3, PackageCheck, RefreshCw, Search, XCircle } from 'lucide-react';
import NavbarHome from '../components/NavbarHome';
import Footer from '../components/Footer';
import api from '../services/api';
import { formatRupiah } from '../utils/formatRupiah';

const progress = [
  { key: 'pending', label: 'Menunggu konfirmasi', description: 'Admin memeriksa pesanan dan pembayaran.', icon: Clock3 },
  { key: 'confirmed', label: 'Order dikonfirmasi', description: 'Customer sudah menyetujui order. Pembayaran dapat menyusul sesuai kesepakatan.', icon: CheckCircle2 },
  { key: 'processing', label: 'Sedang dibuat', description: 'Pesanan kue sedang dipersiapkan.', icon: CakeSlice },
  { key: 'ready', label: 'Siap diambil', description: 'Kue siap diambil pada tanggal yang dipilih.', icon: PackageCheck },
  { key: 'completed', label: 'Pesanan selesai', description: 'Pesanan telah diselesaikan.', icon: CheckCircle2 },
];

const orderStatusLabels = {
  pending: 'Menunggu konfirmasi admin',
  confirmed: 'Order dikonfirmasi',
  processing: 'Sedang dibuat',
  ready: 'Siap diambil',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const paymentStatusLabels = { unpaid: 'Menunggu verifikasi pembayaran', partial: 'Pembayaran sebagian terverifikasi', paid: 'Lunas' };

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderNumberParam = searchParams.get('nomor') || '';
  const [orderNumber, setOrderNumber] = useState(orderNumberParam);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    setOrderNumber(orderNumberParam);
    if (!orderNumberParam) {
      setOrder(null);
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError('');
    api.get(`/orders/track/${encodeURIComponent(orderNumberParam)}`, { signal: controller.signal })
      .then((response) => setOrder(response.data?.data || null))
      .catch((err) => {
        if (!controller.signal.aborted) {
          setOrder(null);
          setError(err.response?.data?.message || 'Pesanan tidak ditemukan. Periksa kembali nomor order pada struk.');
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [orderNumberParam, refreshCount]);

  const submit = (event) => {
    event.preventDefault();
    const normalized = orderNumber.trim().toUpperCase();
    if (normalized) setSearchParams({ nomor: normalized });
  };

  const currentStep = progress.findIndex((step) => step.key === order?.status);

  return (
    <div className='min-h-screen bg-quaternary text-primary'>
      <NavbarHome />
      <main className='mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='mx-auto grid size-14 place-items-center rounded-2xl bg-tertiary text-primary'><PackageCheck size={27}/></span>
          <p className='mt-5 text-xs font-bold uppercase tracking-[0.2em] text-secondary'>Pelacakan pesanan</p>
          <h1 className='mt-2 text-3xl font-bold sm:text-4xl'>Cek progres kue kamu</h1>
          <p className='mt-3 leading-relaxed text-primary/65'>Masukkan nomor order yang tertera di struk untuk melihat status dan jadwal pengambilan.</p>
        </div>

        <form onSubmit={submit} className='mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm sm:flex-row sm:p-5'>
          <label htmlFor='order-number' className='sr-only'>Nomor order</label>
          <input id='order-number' value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} required maxLength={30} placeholder='Contoh: ORD-20261013-1234' className='min-h-12 min-w-0 flex-1 rounded-xl border border-secondary/25 px-4 font-mono text-sm uppercase outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/15' />
          <button type='submit' disabled={loading || !orderNumber.trim()} className='inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-5 font-semibold text-white transition hover:bg-secondary/90 disabled:cursor-wait disabled:opacity-60'>
            <Search size={17}/>{loading ? 'Mencari…' : 'Lacak pesanan'}
          </button>
        </form>

        {error && <div role='alert' className='mx-auto mt-5 flex max-w-2xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800'><AlertCircle size={19} className='mt-0.5 shrink-0'/><p>{error}</p></div>}
        {loading && <p className='mt-8 text-center text-sm text-primary/60'>Memuat informasi pesanan…</p>}

        {order && !loading && <section aria-live='polite' className='mx-auto mt-8 max-w-2xl space-y-5'>
          <div className='rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-7'>
            <div className='flex flex-col justify-between gap-3 border-b border-secondary/15 pb-5 sm:flex-row sm:items-start'>
              <div><p className='text-xs font-semibold uppercase tracking-widest text-primary/50'>Nomor order</p><h2 className='mt-1 font-mono text-xl font-bold'>{order.order_number}</h2></div>
              <div className='flex items-center gap-3 sm:flex-col sm:items-end'>
                <span className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-bold ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                  {orderStatusLabels[order.status] || order.status}
                </span>
                <button type='button' onClick={() => setRefreshCount((count) => count + 1)} disabled={loading} className='inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary/75 disabled:opacity-50'><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Perbarui</button>
              </div>
            </div>

            {order.status === 'cancelled' ? <div className='mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800'><XCircle className='shrink-0' size={20}/><p>Pesanan ini dibatalkan. Hubungi NIFACake jika Anda membutuhkan informasi lebih lanjut.</p></div> : (
              <ol className='mt-6 space-y-5'>
                {progress.map((step, index) => {
                  const Icon = step.icon;
                  const done = currentStep >= 0 && index <= currentStep;
                  const active = index === currentStep;
                  return <li key={step.key} className='relative flex gap-4'>
                    {index < progress.length - 1 && <span className={`absolute left-5 top-11 h-[calc(100%+0.25rem)] w-px ${currentStep >= 0 && index < currentStep ? 'bg-secondary' : 'bg-primary/10'}`} aria-hidden='true'/>}
                    <span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full ${done ? 'bg-secondary text-white' : 'bg-primary/5 text-primary/35'}`}>{done && index < currentStep ? <Check size={17}/> : <Icon size={18}/>}</span>
                    <div className='pt-0.5'><h3 className={`font-semibold ${active ? 'text-secondary' : done ? 'text-primary' : 'text-primary/45'}`}>{step.label}</h3><p className={`mt-1 text-sm ${done ? 'text-primary/65' : 'text-primary/40'}`}>{step.description}</p></div>
                  </li>;
                })}
              </ol>
            )}
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <div className='rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm'>
              <h2 className='font-bold'>Ringkasan</h2>
              <dl className='mt-4 space-y-3 text-sm'>
                <div className='flex justify-between gap-3'><dt className='text-primary/55'>Tanggal order</dt><dd className='text-right font-medium'>{formatDate(order.order_date)}</dd></div>
                <div className='flex justify-between gap-3'><dt className='text-primary/55'>Pengambilan</dt><dd className='text-right font-medium'>{formatDate(order.pickup_date)}</dd></div>
                <div className='flex justify-between gap-3'><dt className='text-primary/55'>Pembayaran</dt><dd className='text-right font-medium'>{paymentStatusLabels[order.payment_status] || order.payment_status}</dd></div>
                <div className='flex justify-between gap-3 border-t border-secondary/15 pt-3'><dt className='font-semibold'>Total</dt><dd className='font-bold text-secondary'>{formatRupiah(order.total_amount)}</dd></div>
              </dl>
              {order.payment_status === 'unpaid' && order.status !== 'cancelled' && <p className='mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800'>{order.payment_method === 'transfer' ? 'Pembayaran transfer harus diverifikasi admin sebelum pesanan mulai diproses.' : order.status === 'confirmed' || ['processing', 'ready'].includes(order.status) ? 'Order sudah dikonfirmasi. Pembayaran tunai akan dicatat admin setelah uang diterima.' : 'Order menunggu konfirmasi admin. Pembayaran tunai dapat dilakukan kemudian sesuai kesepakatan dengan toko.'}</p>}
            </div>

            <div className='rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm'>
              <h2 className='font-bold'>Kue yang dipesan</h2>
              {order.items?.length ? <ul className='mt-4 space-y-3'>{order.items.map((item, index) => <li key={`${item.name}-${index}`} className='flex items-start justify-between gap-3 text-sm'><span className='flex items-start gap-2'><CakeSlice size={17} className='mt-0.5 shrink-0 text-secondary'/><span>{item.name}</span></span><span className='shrink-0 font-semibold'>× {item.quantity}</span></li>)}</ul> : <p className='mt-3 text-sm text-primary/55'>Rincian kue tidak tersedia.</p>}
            </div>
          </div>
        </section>}
      </main>
      <Footer />
    </div>
  );
}
