import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../services/api';
import { FileText, DollarSign, CheckCircle2, Clock, Filter, Calendar, CreditCard, Building2, Image as ImageIcon, RefreshCw, TrendingUp, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Download, XCircle } from 'lucide-react';

const PAGE_SIZE = 20;

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'orders' | 'expenses'
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentActionNotice, setPaymentActionNotice] = useState('');
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [periodPreset, setPeriodPreset] = useState('all');
  const [exporting, setExporting] = useState(false);

  // Filters for Payments
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  // Filters for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderPaymentStatusFilter, setOrderPaymentStatusFilter] = useState('');

  // Date Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Selected payment proof modal
  const [previewImage, setPreviewImage] = useState(null);
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, paymentStatusFilter, paymentMethodFilter, orderStatusFilter, orderPaymentStatusFilter, dateFrom, dateTo, page]);

  const fetchData = async () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      setError('Tanggal awal tidak boleh melewati tanggal akhir.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const periodParams = {};
      if (dateFrom) periodParams.start_date = dateFrom;
      if (dateTo) periodParams.end_date = dateTo;
      const summaryResponse = await api.get('/reports/summary', { params: periodParams });
      setSummary(summaryResponse.data);

      if (activeTab === 'payments') {
        const params = { ...periodParams, page, limit: PAGE_SIZE };
        if (paymentStatusFilter) params.status = paymentStatusFilter;
        if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
        const res = await api.get('/payments', { params });
        setPayments(res.data?.data || res.data?.rows || (Array.isArray(res.data) ? res.data : []));
        setPageInfo({ currentPage: res.data?.currentPage || page, totalPages: res.data?.totalPages || 1, totalItems: res.data?.totalItems || 0 });
      } else if (activeTab === 'orders') {
        const params = { page, limit: PAGE_SIZE };
        if (orderStatusFilter) params.status = orderStatusFilter;
        if (orderPaymentStatusFilter) params.payment_status = orderPaymentStatusFilter;
        if (dateFrom) params.order_date_start = dateFrom;
        if (dateTo) params.order_date_end = dateTo;
        const res = await api.get('/orders', { params });
        setOrders(res.data?.data || res.data?.rows || (Array.isArray(res.data) ? res.data : []));
        setPageInfo({ currentPage: res.data?.currentPage || page, totalPages: res.data?.totalPages || 1, totalItems: res.data?.totalItems || 0 });
      } else {
        const params = { ...periodParams, page, limit: PAGE_SIZE };
        const expenseRes = await api.get('/expenses', { params });
        setExpenses(expenseRes.data?.data || expenseRes.data?.rows || (Array.isArray(expenseRes.data) ? expenseRes.data : []));
        setPageInfo({ currentPage: expenseRes.data?.currentPage || page, totalPages: expenseRes.data?.totalPages || 1, totalItems: expenseRes.data?.totalItems || 0 });
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat data laporan');
    } finally {
      setLoading(false);
    }
  };

  const changePage = (nextPage) => {
    setPage(Math.max(1, Math.min(pageInfo.totalPages, nextPage)));
  };

  const applyPeriod = (preset) => {
    setPeriodPreset(preset);
    const now = new Date();
    if (preset === 'today') {
      const today = toDateInputValue(now);
      setDateFrom(today);
      setDateTo(today);
    } else if (preset === 'month') {
      setDateFrom(toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1)));
      setDateTo(toDateInputValue(now));
    } else {
      setDateFrom('');
      setDateTo('');
    }
    setPage(1);
  };

  const exportCurrentReport = async () => {
    setExporting(true);
    setError('');
    try {
      const params = { type: activeTab };
      if (dateFrom) params.start_date = dateFrom;
      if (dateTo) params.end_date = dateTo;
      if (activeTab === 'payments') {
        if (paymentStatusFilter) params.status = paymentStatusFilter;
        if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
      }
      if (activeTab === 'orders') {
        if (orderStatusFilter) params.status = orderStatusFilter;
        if (orderPaymentStatusFilter) params.payment_status = orderPaymentStatusFilter;
      }
      const response = await api.get('/reports/export', { params, responseType: 'blob' });
      const fileUrl = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `laporan-${activeTab}-${dateFrom || 'awal'}-${dateTo || 'terkini'}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(fileUrl);
    } catch (err) {
      setError(err.message || 'Gagal mengunduh laporan. Silakan coba lagi.');
    } finally {
      setExporting(false);
    }
  };

  const updatePaymentVerification = async (payment, status) => {
    const isVerification = status === 'verified';
    const orderNumber = payment.order?.order_number || `Order #${payment.order_id}`;
    const confirmation = isVerification
      ? `Verifikasi pembayaran ${orderNumber} sebesar ${formatIdr(payment.amount)}?`
      : `Tolak pembayaran ${orderNumber}? Pembayaran yang ditolak tidak dihitung sebagai uang masuk.`;

    if (!window.confirm(confirmation)) return;

    setUpdatingPaymentId(payment.id);
    setPaymentActionNotice('');
    setError('');
    try {
      await api.patch(`/payments/${payment.id}`, { status });
      setPaymentActionNotice(`Pembayaran ${orderNumber} berhasil ${isVerification ? 'diverifikasi' : 'ditolak'}.`);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memperbarui status pembayaran.');
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const formatIdr = (num) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTrendPeriod = (period, granularity) => {
    const date = new Date(`${period}${granularity === 'month' ? '-01' : ''}T12:00:00`);
    return date.toLocaleDateString('id-ID', granularity === 'month' ? { month: 'short', year: 'numeric' } : { day: '2-digit', month: 'short' });
  };

  const matchesSearch = (values) => values.some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()));
  const filteredPayments = payments.filter((item) => matchesSearch([item.order?.order_number, item.id, item.payment_method, item.status]));
  const filteredOrders = orders.filter((item) => matchesSearch([item.order_number, item.customer?.name, item.Customer?.name, item.customer?.phone, item.Customer?.phone]));
  const filteredExpenses = expenses.filter((item) => matchesSearch([item.description, item.category?.name, item.id]));
  const paymentStats = {
    totalCount: summary?.payments?.totalCount || 0,
    totalNominal: summary?.payments?.totalAmount || 0,
    verifiedNominal: summary?.payments?.verifiedAmount || 0,
    pendingNominal: summary?.payments?.pendingAmount || 0,
  };
  const orderStats = {
    totalOrders: summary?.orders?.totalCount || 0,
    totalRevenue: summary?.orders?.value || 0,
    paidOrders: summary?.orders?.paidCount || 0,
    outstandingAmount: summary?.orders?.outstandingAmount || 0,
    pendingOrders: (summary?.orders?.unpaidCount || 0) + (summary?.orders?.partialCount || 0),
  };
  const totalExpenses = summary?.expenses?.totalAmount || 0;
  const verifiedIncome = summary?.cashSummary?.verifiedIncome || 0;
  const netRecordedCash = summary?.cashSummary?.netRecordedCash || 0;

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getPaymentStatusLabel = (status) => ({ verified: 'Terverifikasi', rejected: 'Ditolak', pending: 'Menunggu' }[status] || status || 'Menunggu');
  const getPaymentTypeLabel = (type) => ({
    dp: 'DP / Uang Muka',
    partial: 'DP / Uang Muka',
    repayment: 'Pelunasan',
    settlement: 'Pelunasan',
    full: 'Lunas Sekaligus',
  }[String(type || 'full').toLowerCase()] || type || 'Lunas Sekaligus');

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ready':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getOrderStatusLabel = (status) => ({ pending: 'Menunggu', confirmed: 'Terkonfirmasi', processing: 'Diproses', ready: 'Siap Diambil', completed: 'Selesai', cancelled: 'Dibatalkan' }[status] || status);

  return (
    <div className='min-w-0 space-y-5 sm:space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='flex items-center gap-2 text-xl font-bold text-primary sm:text-2xl'>
            <FileText className='h-5 w-5 shrink-0 text-secondary sm:h-6 sm:w-6' />
            Laporan & Rekap Transaksi
          </h1>
          <p className='text-sm text-primary/60 mt-1'>Pantau nilai pesanan, pembayaran terverifikasi, dan pengeluaran toko.</p>
        </div>

        <div className='flex w-full flex-col items-start gap-1 sm:w-auto sm:items-end'>
          <div className='grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto'>
            <button onClick={exportCurrentReport} disabled={exporting || loading} className='flex min-w-0 items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-white px-3 py-2 text-primary text-xs font-semibold transition hover:bg-secondary/10 disabled:opacity-60 sm:px-4 sm:text-sm'>
              <Download className='w-4 h-4' />
              {exporting ? 'Menyiapkan...' : 'Ekspor CSV'}
            </button>
            <button onClick={fetchData} disabled={loading} className='flex min-w-0 items-center justify-center gap-2 rounded-xl bg-secondary/15 px-3 py-2 text-primary text-xs font-semibold transition hover:bg-secondary/25 disabled:opacity-60 sm:px-4 sm:text-sm'>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Memuat...' : 'Refresh Data'}
            </button>
          </div>
          <span className='text-xs text-primary/50 sm:text-right'>Diperbarui: {lastUpdated ? formatDate(lastUpdated) : 'belum tersedia'}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className='-mx-4 overflow-x-auto overscroll-x-contain border-b border-secondary/20 px-4 pb-2 sm:mx-0 sm:px-0'>
        <div className='flex w-max min-w-full gap-2 sm:w-auto sm:min-w-0'>
          <button
            onClick={() => { setActiveTab('payments'); setPage(1); }}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition sm:px-4 sm:text-sm ${activeTab === 'payments' ? 'bg-secondary text-white shadow-sm' : 'bg-white text-primary/70 hover:bg-secondary/10'}`}>
            <CreditCard className='w-4 h-4' />
            Laporan Pembayaran Masuk
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setPage(1); }}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition sm:px-4 sm:text-sm ${activeTab === 'orders' ? 'bg-secondary text-white shadow-sm' : 'bg-white text-primary/70 hover:bg-secondary/10'}`}>
            <TrendingUp className='w-4 h-4' />
            Laporan Pre-Order & Omzet
          </button>
          <button
            onClick={() => { setActiveTab('expenses'); setPage(1); }}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition sm:px-4 sm:text-sm ${activeTab === 'expenses' ? 'bg-secondary text-white shadow-sm' : 'bg-white text-primary/70 hover:bg-secondary/10'}`}>
            <TrendingUp className='w-4 h-4' />
            Laporan Arus Kas & Pengeluaran
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {activeTab === 'payments' ? (
        <div className='grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4'>
          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-primary/60 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Total Pembayaran</span>
              <span className='p-2 bg-secondary/10 rounded-lg text-primary'>
                <CreditCard className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{paymentStats.totalCount} Transaksi</p>
            <p className='text-xs text-primary/50 mt-1'>Semua metode (Cash & Transfer)</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-primary/60 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Total Nominal</span>
              <span className='p-2 bg-secondary/10 text-secondary rounded-lg'>
                <DollarSign className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{formatIdr(paymentStats.totalNominal)}</p>
            <p className='text-xs text-primary/50 mt-1'>Mencakup semua status pembayaran</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-green-700 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Terverifikasi</span>
              <span className='p-2 bg-green-100 rounded-lg'>
                <CheckCircle2 className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-green-700'>{formatIdr(paymentStats.verifiedNominal)}</p>
            <p className='text-xs text-green-600/70 mt-1'>Uang masuk tervalidasi</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-amber-700 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Pending Bukti</span>
              <span className='p-2 bg-amber-100 rounded-lg'>
                <Clock className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-amber-700'>{formatIdr(paymentStats.pendingNominal)}</p>
            <p className='text-xs text-amber-600/70 mt-1'>Menunggu konfirmasi admin</p>
          </div>
        </div>
      ) : activeTab === 'orders' ? (
        <div className='grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4'>
          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-primary/60 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Total Pre-Order</span>
              <span className='p-2 bg-secondary/10 rounded-lg text-primary'>
                <FileText className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{orderStats.totalOrders} Pesanan</p>
            <p className='text-xs text-primary/50 mt-1'>Semua status order, termasuk yang dibatalkan</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-secondary mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Nilai PO Aktif</span>
              <span className='p-2 bg-secondary/10 rounded-lg'>
                <TrendingUp className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{formatIdr(orderStats.totalRevenue)}</p>
            <p className='text-xs text-primary/50 mt-1'>Tidak termasuk pesanan yang dibatalkan</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-green-700 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Lunas (Paid)</span>
              <span className='p-2 bg-green-100 rounded-lg'>
                <CheckCircle2 className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-green-700'>{orderStats.paidOrders} Pesanan</p>
            <p className='text-xs text-green-600/70 mt-1'>Pembayaran telah selesai</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-amber-700 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Sisa Tagihan</span>
              <span className='p-2 bg-amber-100 rounded-lg'>
                <AlertCircle className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-amber-700'>{formatIdr(orderStats.outstandingAmount)}</p>
            <p className='text-xs text-amber-600/70 mt-1'>{orderStats.pendingOrders} pesanan belum lunas dalam periode ini</p>
          </div>
        </div>
      ) : (
        <div className='grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4'>
          {/* Profit Margin Summary */}
          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-green-700 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Pendapatan Terverifikasi</span>
              <span className='p-2 bg-green-100 rounded-lg'>
                <DollarSign className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-green-700'>{formatIdr(verifiedIncome)}</p>
            <p className='text-xs text-green-600/70 mt-1'>Pembayaran yang sudah diverifikasi</p>
          </div>
          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-primary/60 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Total Pengeluaran</span>
              <span className='p-2 bg-red-100 text-red-700 rounded-lg'>
                <AlertCircle className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{formatIdr(totalExpenses)}</p>
            <p className='text-xs text-primary/50 mt-1'>Uang keluar</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-primary/60 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Surplus Kas Tercatat</span>
              <span className='p-2 bg-blue-100 text-blue-700 rounded-lg'>
                <TrendingUp className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{formatIdr(netRecordedCash)}</p>
            <p className='text-xs text-primary/50 mt-1'>Pembayaran terverifikasi − pengeluaran tercatat</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-primary/60 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Pembayaran Pending</span>
              <span className='p-2 bg-green-100 text-green-700 rounded-lg'>
                <TrendingUp className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{formatIdr(summary?.payments?.pendingAmount || 0)}</p>
            <p className='text-xs text-primary/50 mt-1'>{summary?.payments?.pendingCount || 0} transaksi menunggu verifikasi</p>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (summary?.expenses?.byCategory || []).length > 0 && (
        <section className='rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm sm:p-5'>
          <div className='mb-4'>
            <h2 className='font-semibold text-primary'>Pengeluaran per Kategori</h2>
            <p className='text-xs text-primary/55 mt-1'>Kategori dengan nominal terbesar pada periode yang dipilih.</p>
          </div>
          <div className='space-y-4'>
            {summary.expenses.byCategory.slice(0, 5).map((category) => {
              const maxAmount = summary.expenses.byCategory[0]?.amount || 1;
              const width = Math.max(3, (category.amount / maxAmount) * 100);
              return (
                <div key={category.categoryId}>
                  <div className='flex justify-between gap-4 text-sm mb-1'>
                    <span className='text-primary font-medium'>{category.categoryName}</span>
                    <span className='text-primary/70'>{formatIdr(category.amount)}</span>
                  </div>
                  <div className='h-2 bg-secondary/10 rounded-full overflow-hidden'>
                    <div className='h-full bg-secondary rounded-full' style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'expenses' && (summary?.trends?.rows || []).length > 0 && (
        <section className='bg-white rounded-2xl border border-secondary/20 shadow-sm overflow-hidden'>
          <div className='p-5 border-b border-secondary/15'>
            <h2 className='font-semibold text-primary'>Tren Order dan Arus Kas</h2>
            <p className='text-xs text-primary/55 mt-1'>Ringkasan per {summary.trends.granularity === 'day' ? 'hari' : 'bulan'}; pembayaran berdasarkan tanggal verifikasi.</p>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm min-w-180 text-primary/80'>
              <thead className='bg-quaternary text-xs uppercase text-primary/65'>
                <tr>
                  <th className='px-5 py-3'>Periode</th>
                  <th className='px-5 py-3 text-right'>Jumlah PO</th>
                  <th className='px-5 py-3 text-right'>Nilai PO</th>
                  <th className='px-5 py-3 text-right'>Pembayaran diterima</th>
                  <th className='px-5 py-3 text-right'>Pengeluaran</th>
                  <th className='px-5 py-3 text-right'>Surplus kas</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-secondary/10'>
                {summary.trends.rows.map((row) => (
                  <tr key={row.period} className='hover:bg-secondary/5'>
                    <td className='px-5 py-3 font-medium'>{formatTrendPeriod(row.period, summary.trends.granularity)}</td>
                    <td className='px-5 py-3 text-right'>{row.orderCount}</td>
                    <td className='px-5 py-3 text-right'>{formatIdr(row.orderValue)}</td>
                    <td className='px-5 py-3 text-right'>{formatIdr(row.verifiedIncome)}</td>
                    <td className='px-5 py-3 text-right'>{formatIdr(row.expenses)}</td>
                    <td className={`px-5 py-3 text-right font-semibold ${row.netRecordedCash < 0 ? 'text-red-700' : 'text-green-700'}`}>{formatIdr(row.netRecordedCash)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'orders' && (summary?.topProducts || []).length > 0 && (
        <section className='rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm sm:p-5'>
          <div className='mb-4'>
            <h2 className='font-semibold text-primary'>Produk Paling Banyak Dipesan</h2>
            <p className='text-xs text-primary/55 mt-1'>Berdasarkan jumlah produk pada pesanan yang tidak dibatalkan.</p>
          </div>
          <div className='space-y-4'>
            {summary.topProducts.map((product) => {
              const maxQuantity = summary.topProducts[0]?.quantity || 1;
              const width = Math.max(3, (product.quantity / maxQuantity) * 100);
              return (
                <div key={product.productId}>
                  <div className='flex justify-between gap-4 text-sm mb-1'>
                    <span className='text-primary font-medium'>{product.productName}</span>
                    <span className='text-primary/70'>{product.quantity} terjual · {formatIdr(product.orderValue)}</span>
                  </div>
                  <div className='h-2 bg-secondary/10 rounded-full overflow-hidden'>
                    <div className='h-full bg-secondary rounded-full' style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'expenses' && summary?.note && (
        <div className='flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900'>
          <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' />
          <p>{summary.note}</p>
        </div>
      )}

      {/* Filter Control Section */}
      <div className='min-w-0 space-y-4 rounded-2xl border border-secondary/20 bg-white p-3 shadow-sm sm:p-4'>
        <div className='flex items-center gap-2 text-primary font-semibold text-sm'>
          <Filter className='w-4 h-4 text-secondary' />
          Filter Data Laporan
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <span className='mr-1 w-full text-xs text-primary/60 sm:w-auto'>Periode cepat:</span>
          {[
            { value: 'today', label: 'Hari ini' },
            { value: 'month', label: 'Bulan ini' },
            { value: 'all', label: 'Semua waktu' },
          ].map((preset) => (
            <button
              key={preset.value}
              type='button'
              onClick={() => applyPeriod(preset.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${periodPreset === preset.value ? 'bg-secondary text-white' : 'bg-secondary/10 text-primary/70 hover:bg-secondary/20'}`}>
              {preset.label}
            </button>
          ))}
          <span className='w-full text-xs leading-relaxed text-primary/50 sm:ml-auto sm:w-auto sm:max-w-md sm:text-right'>Tanggal pembayaran memakai tanggal verifikasi; PO memakai tanggal order; pengeluaran memakai tanggal pengeluaran.</span>
        </div>
        <p className='text-xs text-primary/50'>Kartu ringkasan mencakup seluruh data pada periode; filter status dan metode hanya menyaring tabel dan file ekspor.</p>

        <form className='flex max-w-xl gap-2' onSubmit={(event) => { event.preventDefault(); setSearch(searchInput.trim()); setPage(1); }}>
          <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={activeTab === 'orders' ? 'Cari nomor PO atau pelanggan' : activeTab === 'payments' ? 'Cari nomor PO atau metode pembayaran' : 'Cari deskripsi atau kategori pengeluaran'} className='min-w-0 flex-1 rounded-xl border border-secondary/20 bg-secondary/10 px-3 py-2 text-sm focus:outline-none focus:border-secondary' />
          <button type='submit' className='rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white'>Cari</button>
        </form>

        <div className='grid min-w-0 grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          {activeTab === 'payments' ? (
            <>
              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Status Verifikasi</label>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}
                  className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary'>
                  <option value=''>Semua Status</option>
                  <option value='verified'>Terverifikasi</option>
                  <option value='pending'>Menunggu verifikasi</option>
                  <option value='rejected'>Ditolak</option>
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Metode Pembayaran</label>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => { setPaymentMethodFilter(e.target.value); setPage(1); }}
                  className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary'>
                  <option value=''>Semua Metode</option>
                  <option value='cash'>Tunai / Cash</option>
                  <option value='transfer'>Transfer Bank</option>
                </select>
              </div>
            </>
          ) : activeTab === 'orders' ? (
            <>
              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Status Pesanan</label>
                <select value={orderStatusFilter} onChange={(e) => { setOrderStatusFilter(e.target.value); setPage(1); }} className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary'>
                  <option value=''>Semua Status Pesanan</option>
                  <option value='pending'>Menunggu</option>
                  <option value='confirmed'>Terkonfirmasi</option>
                  <option value='processing'>Diproses</option>
                  <option value='ready'>Siap diambil</option>
                  <option value='completed'>Selesai</option>
                  <option value='cancelled'>Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Status Pelunasan</label>
                <select
                  value={orderPaymentStatusFilter}
                  onChange={(e) => { setOrderPaymentStatusFilter(e.target.value); setPage(1); }}
                  className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary'>
                  <option value=''>Semua Pelunasan</option>
                  <option value='unpaid'>Belum bayar</option>
                  <option value='partial'>DP / sebagian</option>
                  <option value='paid'>Lunas</option>
                </select>
              </div>
            </>
          ) : null}

          <div>
            <label className='block text-xs font-medium text-primary/70 mb-1'>Dari Tanggal</label>
            <input type='date' value={dateFrom} max={dateTo || undefined} onChange={(e) => { setDateFrom(e.target.value); setPeriodPreset('custom'); setPage(1); }} className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary' />
          </div>

          <div>
            <label className='block text-xs font-medium text-primary/70 mb-1'>Sampai Tanggal</label>
            <input type='date' value={dateTo} min={dateFrom || undefined} onChange={(e) => { setDateTo(e.target.value); setPeriodPreset('custom'); setPage(1); }} className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary' />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex flex-wrap items-center justify-between gap-3'>
          <span>{error}</span>
          {!(dateFrom && dateTo && dateFrom > dateTo) && <button onClick={fetchData} className='font-semibold underline underline-offset-2'>Coba lagi</button>}
        </div>
      )}
      {paymentActionNotice && (
        <div role='status' className='rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800'>
          {paymentActionNotice}
        </div>
      )}

      {/* Table Container */}
      <div className='min-w-0 overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-sm'>
        {loading ? (
          <div className='p-12 text-center text-primary/50 flex flex-col items-center justify-center gap-2'>
            <RefreshCw className='w-6 h-6 animate-spin text-secondary' />
            <p className='text-sm'>Memuat data laporan...</p>
          </div>
        ) : activeTab === 'expenses' ? (
          filteredExpenses.length === 0 ? (
            <div className='p-12 text-center text-primary/50'>
              <TrendingUp className='w-10 h-10 mx-auto text-secondary/40 mb-2' />
              <p className='font-medium'>Belum ada pengeluaran sesuai filter</p>
              <p className='text-xs mt-1'>Coba sesuaikan pilihan tanggal atau filter di atas</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-190 text-left text-xs'>
                <thead className='bg-quaternary border-b border-secondary/15 text-primary/70 text-xs font-bold uppercase tracking-wider'>
                  <tr>
                    <th className='px-5 py-4'>No.</th>
                    <th className='px-5 py-4'>ID & Tanggal</th>
                    <th className='px-5 py-4'>Kategori</th>
                    <th className='px-5 py-4'>Deskripsi</th>
                    <th className='px-5 py-4'>Nominal</th>
                    <th className='px-5 py-4'>Metode</th>
                    <th className='px-5 py-4 text-center'>Rincian</th>
                    <th className='px-5 py-4 text-center'>Bukti</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-secondary/10 text-primary'>
                  {filteredExpenses.map((e, index) => {
                    const category = e.category?.name || '-';
                    const proofUrl = e.receipt ? (e.receipt.startsWith('http') ? e.receipt : `${API_URL}${e.receipt}`) : null;
                    const purchase = e.purchase;
                    const purchaseItems = purchase?.items || [];
                    const isExpanded = expandedExpenseId === e.id;

                    return (
                      <React.Fragment key={e.id}>
                        <tr
                          className={`hover:bg-secondary/5 transition ${purchase ? 'cursor-pointer' : ''}`}
                          onClick={() => purchase && setExpandedExpenseId(isExpanded ? null : e.id)}
                        >
                          <td className='px-5 py-4 text-xs text-primary/60'>{index + 1}</td>
                          <td className='px-5 py-4'>
                            <span className='font-mono font-bold text-xs block text-primary/60'>{e.expense_number || `EXP-${String(e.id).padStart(4, '0')}`}</span>
                            <span className='text-xs text-primary/50 flex items-center gap-1 mt-0.5'>
                              <Calendar className='w-3 h-3' />
                              {formatDate(e.expense_date)}
                            </span>
                          </td>
                          <td className='px-5 py-4'>
                            <span className='capitalize font-medium block text-primary'>{category}</span>
                          </td>
                          <td className='px-5 py-4'>
                            <span className='text-xs text-primary/60'>{e.description || '-'}</span>
                          </td>
                          <td className='px-5 py-4 font-bold text-primary'>{formatIdr(e.amount)}</td>
                          <td className='px-5 py-4'>
                            <span className='capitalize font-medium block text-primary'>{String(e.payment_method).toLowerCase() === 'transfer' ? 'Transfer' : 'Tunai'}</span>
                          </td>
                          <td className='px-5 py-4 text-center'>
                            {purchase && (
                              <button
                                type='button'
                                aria-expanded={isExpanded}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setExpandedExpenseId(isExpanded ? null : e.id);
                                }}
                                className='inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition'
                              >
                                {isExpanded ? <ChevronUp className='w-3.5 h-3.5' /> : <ChevronDown className='w-3.5 h-3.5' />}
                                Rincian bahan
                              </button>
                            )}
                          </td>
                          <td className='px-5 py-4 text-center'>
                            {proofUrl ? (
                              <button
                                onClick={() => setPreviewImage(proofUrl)}
                                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary hover:text-white text-primary text-xs font-medium transition'
                                title='Lihat Bukti'>
                                <ImageIcon className='w-3.5 h-3.5' />
                                Lihat Bukti
                              </button>
                            ) : (
                              <span className='text-xs text-primary/40 italic'>Tidak Ada</span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && purchase && (
                          <tr className='bg-blue-50/40'>
                            <td colSpan={8} className='px-6 py-4'>
                              <div className='rounded-xl border border-blue-200 bg-white p-4'>
                                <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                                  <h3 className='text-sm font-semibold text-primary'>Rincian pembelian bahan: {purchase.purchase_number}</h3>
                                  <span className='text-sm font-bold text-primary'>Total: {formatIdr(purchase.total_amount)}</span>
                                </div>
                                {purchaseItems.length === 0 ? (
                                  <p className='text-xs text-primary/55'>Belum ada rincian item pembelian.</p>
                                ) : (
                                  <div className='overflow-x-auto'>
                                    <table className='w-full min-w-110 text-xs'>
                                      <thead className='text-left uppercase text-primary/60'>
                                        <tr>
                                          <th className='py-2 pr-3'>Bahan</th>
                                          <th className='py-2 px-3 text-right'>Jumlah</th>
                                          <th className='py-2 px-3 text-right'>Harga satuan</th>
                                          <th className='py-2 pl-3 text-right'>Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody className='divide-y divide-secondary/10'>
                                        {purchaseItems.map((item) => (
                                          <tr key={item.id}>
                                            <td className='py-2 pr-3'>{item.material?.name || `Material #${item.material_id}`}</td>
                                            <td className='py-2 px-3 text-right'>{Number(item.quantity).toLocaleString('id-ID')} {item.unit_name || item.material?.unit || ''}</td>
                                            <td className='py-2 px-3 text-right'>{formatIdr(item.unit_price)}</td>
                                            <td className='py-2 pl-3 text-right font-semibold'>{formatIdr(item.subtotal)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'payments' ? (
          filteredPayments.length === 0 ? (
            <div className='p-12 text-center text-primary/50'>
              <CreditCard className='w-10 h-10 mx-auto text-secondary/40 mb-2' />
              <p className='font-medium'>Belum ada transaksi pembayaran sesuai filter</p>
              <p className='text-xs mt-1'>Coba sesuaikan pilihan tanggal atau filter status di atas</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-205 text-left text-sm'>
                <thead className='bg-quaternary border-b border-secondary/15 text-primary/70 text-xs font-bold uppercase tracking-wider'>
                  <tr>
                    <th className='px-5 py-4'>ID & Tanggal</th>
                    <th className='px-5 py-4'>No. Order</th>
                    <th className='px-5 py-4'>Metode / Rekening</th>
                    <th className='px-5 py-4'>Tipe</th>
                    <th className='px-5 py-4'>Nominal</th>
                    <th className='px-5 py-4'>Status</th>
                    <th className='px-5 py-4 text-center'>Bukti</th>
                    <th className='px-5 py-4 text-center'>Tindakan</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-secondary/10 text-primary'>
                  {filteredPayments.map((p) => {
                    const proofUrl = p.payment_proof ? (p.payment_proof.startsWith('http') ? p.payment_proof : `${API_URL}${p.payment_proof}`) : null;

                    return (
                      <tr key={p.id} className='hover:bg-secondary/5 transition'>
                        <td className='px-5 py-4'>
                          <span className='font-mono font-bold text-xs block text-primary/60'>#PAY-{String(p.id).padStart(4, '0')}</span>
                          <span className='text-xs text-primary/50 flex items-center gap-1 mt-0.5'>
                            <Calendar className='w-3 h-3' />
                            {formatDate(p.paid_at || p.created_at)}
                          </span>
                        </td>
                        <td className='px-5 py-4'>
                          <span className='font-semibold text-primary block'>{p.order?.order_number || `Order #${p.order_id}`}</span>
                          <span className='text-xs text-primary/60'>Total Order: {formatIdr(p.order?.total_amount)}</span>
                        </td>
                        <td className='px-5 py-4'>
                          <span className='capitalize font-medium block text-primary'>{p.payment_method === 'transfer' ? 'Transfer Bank' : 'Tunai / Cash'}</span>
                          {p.rekening && (
                            <span className='text-xs text-primary/60 flex items-center gap-1 mt-0.5'>
                              <Building2 className='w-3 h-3' />
                              {p.rekening.bank_name} ({p.rekening.account_number})
                            </span>
                          )}
                        </td>
                        <td className='px-5 py-4'>
                          <span className='text-xs font-semibold px-2 py-0.5 rounded bg-secondary/15 text-primary/80'>{getPaymentTypeLabel(p.payment_type)}</span>
                        </td>
                        <td className='px-5 py-4 font-bold text-primary'>{formatIdr(p.amount)}</td>
                        <td className='px-5 py-4'>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusBadge(p.status)}`}>{getPaymentStatusLabel(p.status)}</span>
                        </td>
                        <td className='px-5 py-4 text-center'>
                          {proofUrl ? (
                            <button
                              onClick={() => setPreviewImage(proofUrl)}
                              className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary hover:text-white text-primary text-xs font-medium transition'
                              title='Lihat Bukti Transfer'>
                              <ImageIcon className='w-3.5 h-3.5' />
                              Lihat Bukti
                            </button>
                          ) : (
                            <span className='text-xs text-primary/40 italic'>Tidak Ada</span>
                          )}
                        </td>
                        <td className='px-5 py-4'>
                          {p.status === 'pending' ? (
                            <div className='flex min-w-36 flex-col gap-2 sm:flex-row'>
                              <button
                                type='button'
                                onClick={() => updatePaymentVerification(p, 'verified')}
                                disabled={updatingPaymentId === p.id}
                                className='inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-800 transition hover:bg-green-200 disabled:cursor-wait disabled:opacity-60'
                              >
                                <CheckCircle2 className='h-3.5 w-3.5' />
                                {updatingPaymentId === p.id ? 'Memproses…' : 'Verifikasi'}
                              </button>
                              <button
                                type='button'
                                onClick={() => updatePaymentVerification(p, 'rejected')}
                                disabled={updatingPaymentId === p.id}
                                className='inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:cursor-wait disabled:opacity-60'
                              >
                                <XCircle className='h-3.5 w-3.5' />
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className='text-xs text-primary/50'>Sudah ditinjau</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : filteredOrders.length === 0 ? (
          <div className='p-12 text-center text-primary/50'>
            <FileText className='w-10 h-10 mx-auto text-secondary/40 mb-2' />
            <p className='font-medium'>Belum ada pesanan pre-order sesuai filter</p>
            <p className='text-xs mt-1'>Coba sesuaikan pilihan tanggal atau filter di atas</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-160 text-left text-sm'>
              <thead className='bg-quaternary border-b border-secondary/15 text-primary/70 text-xs font-bold uppercase tracking-wider'>
                <tr>
                  <th className='px-5 py-4'>No. Pesanan</th>
                  <th className='px-5 py-4'>Pelanggan</th>
                  <th className='px-5 py-4'>Tgl Pesan & Ambil</th>
                  <th className='px-5 py-4'>Status Order</th>
                  <th className='px-5 py-4'>Status Pembayaran</th>
                  <th className='px-5 py-4 text-right'>Total Tagihan</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-secondary/10 text-primary'>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className='hover:bg-secondary/5 transition'>
                    <td className='px-5 py-4 font-semibold text-primary'>
                      {o.order_number}
                      {o.order_items?.length > 0 && <span className='block text-xs text-primary/50 font-normal mt-0.5'>{o.order_items.length} jenis kue</span>}
                    </td>
                    <td className='px-5 py-4'>
                      <span className='font-medium block text-primary'>{o.customer?.name || o.Customer?.name || 'Customer Umum'}</span>
                      <span className='text-xs text-primary/60'>{o.customer?.phone || o.Customer?.phone || '-'}</span>
                    </td>
                    <td className='px-5 py-4 text-xs text-primary/70'>
                      <div>
                        <span className='text-primary/40'>Pesan:</span> {formatDate(o.order_date || o.created_at)}
                      </div>
                      <div className='mt-0.5'>
                        <span className='text-primary/40'>Ambil:</span> <strong className='text-primary'>{o.pickup_date ? new Date(o.pickup_date).toLocaleDateString('id-ID') : '-'}</strong>
                      </div>
                    </td>
                    <td className='px-5 py-4'>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getOrderStatusBadge(o.status)}`}>{getOrderStatusLabel(o.status)}</span>
                    </td>
                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                          o.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : o.payment_status === 'partial'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {({ paid: 'Lunas', partial: 'DP / Sebagian', unpaid: 'Belum Bayar' }[o.payment_status] || o.payment_status || 'Belum Bayar')}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-right font-bold text-primary'>{formatIdr(o.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && pageInfo.totalItems > 0 && (
        <div className='flex flex-col items-stretch justify-between gap-3 text-center text-sm text-primary/65 sm:flex-row sm:items-center sm:text-left'>
          <span>Menampilkan {(pageInfo.currentPage - 1) * PAGE_SIZE + 1}–{Math.min(pageInfo.currentPage * PAGE_SIZE, pageInfo.totalItems)} dari {pageInfo.totalItems} data</span>
          <div className='flex flex-wrap items-center justify-center gap-2 sm:justify-end'>
            <button type='button' onClick={() => changePage(pageInfo.currentPage - 1)} disabled={pageInfo.currentPage <= 1} className='inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-secondary/25 px-2 py-2 hover:bg-secondary/10 disabled:opacity-40 sm:flex-none sm:px-3'>
              <ChevronLeft className='w-4 h-4' /> Sebelumnya
            </button>
            <span className='w-full px-2 sm:w-auto'>Halaman {pageInfo.currentPage} dari {pageInfo.totalPages}</span>
            <button type='button' onClick={() => changePage(pageInfo.currentPage + 1)} disabled={pageInfo.currentPage >= pageInfo.totalPages} className='inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-secondary/25 px-2 py-2 hover:bg-secondary/10 disabled:opacity-40 sm:flex-none sm:px-3'>
              Selanjutnya <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}

      {/* Modal Preview Bukti Gambar */}
      {previewImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm' onClick={() => setPreviewImage(null)}>
          <div className='bg-white p-4 rounded-2xl max-w-lg w-full shadow-2xl space-y-3 relative' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between border-b border-secondary/20 pb-2'>
              <h3 className='font-bold text-primary flex items-center gap-2'>
                <ImageIcon className='w-4 h-4 text-secondary' />
                Bukti Pembayaran
              </h3>
              <button onClick={() => setPreviewImage(null)} className='text-primary/50 hover:text-primary font-bold text-lg'>
                ✕
              </button>
            </div>

            <div className='max-h-[70vh] overflow-auto flex items-center justify-center bg-quaternary rounded-xl p-2'>
              <img
                src={previewImage}
                alt='Bukti Transfer'
                className='max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm'
                onError={(e) => {
                  e.target.src = '';
                  e.target.alt = 'Gagal memuat gambar bukti pembayaran';
                }}
              />
            </div>

            <div className='flex justify-end pt-2'>
              <button onClick={() => setPreviewImage(null)} className='px-4 py-2 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 transition'>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
