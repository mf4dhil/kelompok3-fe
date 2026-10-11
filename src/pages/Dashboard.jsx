import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardList, CreditCard, Package, RefreshCw, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { ordersService } from '../services/orderService';
import OrderTable from '../components/dashboard/Table';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);

const formatUpdatedAt = (date) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryResponse, ordersResponse] = await Promise.all([
        api.get('/dashboard/summary'),
        ordersService.getAll({
          page: 1,
          limit: 10,
          sort_by: 'created_at',
          sort_order: 'DESC',
        }),
      ]);
      const orderList = Array.isArray(ordersResponse)
        ? ordersResponse
        : ordersResponse.data || ordersResponse.orders || [];

      setSummary(summaryResponse.data);
      setOrders(orderList);
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Gagal memuat ringkasan toko.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const statusCounts = summary?.orders?.statusCounts || {};
  const primaryCards = [
    {
      title: 'Total Pesanan',
      value: summary?.orders?.totalCount ?? '—',
      description: summary ? `${summary.orders.todayCount} pesanan masuk hari ini` : 'Ringkasan belum tersedia',
      icon: Package,
      iconClass: 'bg-secondary/15 text-primary',
      href: '/preorder',
    },
    {
      title: 'Menunggu Diproses',
      value: summary ? statusCounts.pending ?? 0 : '—',
      description: 'Pesanan baru yang perlu ditangani',
      icon: ClipboardList,
      iconClass: 'bg-amber-100 text-amber-700',
      href: '/preorder',
    },
    {
      title: 'Verifikasi Pembayaran',
      value: summary ? summary.payments.pendingVerificationCount : '—',
      description: 'Pembayaran menunggu pemeriksaan',
      icon: CreditCard,
      iconClass: 'bg-blue-100 text-blue-700',
      href: '/laporan',
    },
    {
      title: 'Pesanan Diproses',
      value: summary ? statusCounts.processing ?? 0 : '—',
      description: 'Pesanan yang sedang dibuat',
      icon: CheckCircle2,
      iconClass: 'bg-green-100 text-green-700',
      href: '/preorder',
    },
  ];

  return (
    <div className='space-y-6'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-xl font-bold text-primary sm:text-2xl'>Ringkasan Toko</h1>
          <p className='mt-1 text-sm text-primary/60'>Pantau pesanan, pembayaran, jadwal pickup, dan stok bahan baku.</p>
        </div>
        <div className='flex items-center justify-between gap-3 sm:justify-end'>
          <span className='text-xs text-primary/50'>
            {lastUpdated ? `Diperbarui ${formatUpdatedAt(lastUpdated)}` : 'Belum diperbarui'}
          </span>
          <button
            type='button'
            onClick={fetchDashboard}
            disabled={loading}
            className='inline-flex shrink-0 items-center gap-2 rounded-lg border border-secondary/25 bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-secondary/10 disabled:opacity-60'
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className='hidden sm:inline'>{loading ? 'Memuat...' : 'Perbarui'}</span>
          </button>
        </div>
      </header>

      {error && (
        <div role='alert' className='flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between'>
          <span>{error}</span>
          <button type='button' onClick={fetchDashboard} className='shrink-0 font-semibold underline underline-offset-2'>Coba lagi</button>
        </div>
      )}

      <section aria-label='Ringkasan pesanan' className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {primaryCards.map(({ title, value, description, icon: Icon, iconClass, href }) => (
          <Link
            key={title}
            to={href}
            className='group rounded-xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C86D51]'
          >
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-sm text-primary/60'>{title}</p>
                <p className='mt-2 text-3xl font-bold tabular-nums text-primary'>{loading && value === '—' ? '…' : value}</p>
                <p className='mt-2 text-xs leading-relaxed text-primary/50'>{description}</p>
              </div>
              <span className={`rounded-xl p-3 ${iconClass}`}>
                <Icon className='h-5 w-5' />
              </span>
            </div>
            <span className='mt-4 inline-block text-xs font-semibold text-[#A94F37] group-hover:underline'>Lihat detail →</span>
          </Link>
        ))}
      </section>

      <section aria-label='Ringkasan operasional' className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Link to='/preorder' className='flex items-center gap-4 rounded-xl border border-primary/10 bg-white p-4 shadow-sm transition hover:bg-quaternary'>
          <span className='rounded-lg bg-indigo-100 p-3 text-indigo-700'><CalendarDays className='h-5 w-5' /></span>
          <span className='min-w-0 flex-1'>
            <span className='block text-xs text-primary/55'>Jadwal pickup aktif</span>
            <span className='mt-1 block text-lg font-bold text-primary'>{summary ? `${summary.pickups.next7DaysCount} dalam 7 hari` : '—'}</span>
            <span className='block text-xs text-primary/50'>{summary ? `${summary.pickups.todayCount} pickup hari ini` : 'Data belum tersedia'}</span>
          </span>
        </Link>

        <Link to='/materials/low-stock' className='flex items-center gap-4 rounded-xl border border-primary/10 bg-white p-4 shadow-sm transition hover:bg-quaternary'>
          <span className='rounded-lg bg-amber-100 p-3 text-amber-700'><AlertTriangle className='h-5 w-5' /></span>
          <span className='min-w-0 flex-1'>
            <span className='block text-xs text-primary/55'>Bahan baku perlu dicek</span>
            <span className='mt-1 block text-lg font-bold text-primary'>{summary ? `${summary.inventory.lowStockCount} bahan stok rendah` : '—'}</span>
            <span className='block text-xs text-primary/50'>Stok berada di bawah batas minimum</span>
          </span>
        </Link>

        <Link to='/laporan' className='flex items-center gap-4 rounded-xl border border-primary/10 bg-white p-4 shadow-sm transition hover:bg-quaternary'>
          <span className='rounded-lg bg-green-100 p-3 text-green-700'><TrendingUp className='h-5 w-5' /></span>
          <span className='min-w-0 flex-1'>
            <span className='block text-xs text-primary/55'>Pembayaran terverifikasi hari ini</span>
            <span className='mt-1 block break-words text-lg font-bold text-primary'>{summary ? formatCurrency(summary.payments.verifiedIncomeToday) : '—'}</span>
            <span className='block text-xs text-primary/50'>Berdasarkan waktu pembayaran terverifikasi</span>
          </span>
        </Link>
      </section>

      <section>
        {loading && !summary ? (
          <div className='rounded-xl border border-primary/10 bg-white p-8 text-center text-sm text-primary/55'>Memuat ringkasan toko…</div>
        ) : error && !summary ? (
          <div className='rounded-xl border border-primary/10 bg-white p-8 text-center text-sm text-primary/55'>Data dashboard belum tersedia. Coba muat ulang.</div>
        ) : orders.length === 0 ? (
          <div className='rounded-xl border border-primary/10 bg-white p-8 text-center text-sm text-primary/55'>Belum ada pesanan untuk ditampilkan.</div>
        ) : (
          <OrderTable orders={orders} />
        )}
      </section>
    </div>
  );
}

export default Dashboard;
