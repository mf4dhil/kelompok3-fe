import React, { useState, useEffect } from 'react';
import api from '../services/apiClient';
import {
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Calendar,
  CreditCard,
  Building2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'orders'
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchData();
  }, [
    activeTab,
    paymentStatusFilter,
    paymentMethodFilter,
    orderStatusFilter,
    orderPaymentStatusFilter,
    dateFrom,
    dateTo,
  ]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'payments') {
        const params = { limit: 100 };
        if (paymentStatusFilter) params.status = paymentStatusFilter;
        const res = await api.get('/payments', { params });
        const data = res.data?.data || res.data?.rows || (Array.isArray(res.data) ? res.data : []);
        setPayments(data);
      } else {
        const params = { limit: 100 };
        if (orderStatusFilter) params.status = orderStatusFilter;
        if (orderPaymentStatusFilter) params.payment_status = orderPaymentStatusFilter;
        const res = await api.get('/orders', { params });
        const data = res.data?.data || res.data?.rows || (Array.isArray(res.data) ? res.data : []);
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat data laporan');
    } finally {
      setLoading(false);
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

  // Filter client-side date if needed
  const filteredPayments = payments.filter((p) => {
    if (paymentMethodFilter && p.payment_method !== paymentMethodFilter) return false;
    if (dateFrom) {
      const pDate = new Date(p.created_at || p.createdAt);
      if (pDate < new Date(dateFrom)) return false;
    }
    if (dateTo) {
      const pDate = new Date(p.created_at || p.createdAt);
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (pDate > end) return false;
    }
    return true;
  });

  const filteredOrders = orders.filter((o) => {
    if (dateFrom) {
      const oDate = new Date(o.order_date || o.created_at);
      if (oDate < new Date(dateFrom)) return false;
    }
    if (dateTo) {
      const oDate = new Date(o.order_date || o.created_at);
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (oDate > end) return false;
    }
    return true;
  });

  // Calculation summaries
  const paymentStats = {
    totalCount: filteredPayments.length,
    totalNominal: filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    verifiedNominal: filteredPayments
      .filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    pendingNominal: filteredPayments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  const orderStats = {
    totalOrders: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    paidOrders: filteredOrders.filter((o) => o.payment_status === 'paid').length,
    pendingOrders: filteredOrders.filter((o) => o.payment_status !== 'paid').length,
  };

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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-primary flex items-center gap-2'>
            <FileText className='w-6 h-6 text-[#C86D51]' />
            Laporan & Rekap Transaksi
          </h1>
          <p className='text-sm text-primary/60 mt-1'>
            Pantau arus kas pembayaran, status pelunasan, dan riwayat pre-order pelanggan.
          </p>
        </div>

        <button
          onClick={fetchData}
          className='flex items-center gap-2 px-4 py-2 bg-secondary/15 hover:bg-secondary/25 text-primary text-sm font-semibold rounded-xl transition self-start sm:self-auto'
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className='flex gap-2 border-b border-secondary/20 pb-2'>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
            activeTab === 'payments'
              ? 'bg-[#C86D51] text-white shadow-sm'
              : 'bg-white text-primary/70 hover:bg-secondary/10'
          }`}
        >
          <CreditCard className='w-4 h-4' />
          Laporan Pembayaran Masuk
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
            activeTab === 'orders'
              ? 'bg-[#C86D51] text-white shadow-sm'
              : 'bg-white text-primary/70 hover:bg-secondary/10'
          }`}
        >
          <TrendingUp className='w-4 h-4' />
          Laporan Pre-Order & Omzet
        </button>
      </div>

      {/* Summary Cards */}
      {activeTab === 'payments' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
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
              <span className='p-2 bg-[#C86D51]/10 text-[#C86D51] rounded-lg'>
                <DollarSign className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{formatIdr(paymentStats.totalNominal)}</p>
            <p className='text-xs text-primary/50 mt-1'>Termasuk verified & pending</p>
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
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-primary/60 mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Total Pre-Order</span>
              <span className='p-2 bg-secondary/10 rounded-lg text-primary'>
                <FileText className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{orderStats.totalOrders} Pesanan</p>
            <p className='text-xs text-primary/50 mt-1'>Dalam periode yang difilter</p>
          </div>

          <div className='bg-white p-5 rounded-2xl border border-secondary/20 shadow-sm'>
            <div className='flex items-center justify-between text-[#C86D51] mb-2'>
              <span className='text-xs font-medium uppercase tracking-wider'>Potensi Omzet</span>
              <span className='p-2 bg-[#C86D51]/10 rounded-lg'>
                <TrendingUp className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-primary'>{formatIdr(orderStats.totalRevenue)}</p>
            <p className='text-xs text-primary/50 mt-1'>Nilai total pesanan masuk</p>
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
              <span className='text-xs font-medium uppercase tracking-wider'>Belum Lunas</span>
              <span className='p-2 bg-amber-100 rounded-lg'>
                <AlertCircle className='w-4 h-4' />
              </span>
            </div>
            <p className='text-2xl font-bold text-amber-700'>{orderStats.pendingOrders} Pesanan</p>
            <p className='text-xs text-amber-600/70 mt-1'>Status Unpaid atau Partial</p>
          </div>
        </div>
      )}

      {/* Filter Control Section */}
      <div className='bg-white rounded-2xl border border-secondary/20 p-4 shadow-sm space-y-4'>
        <div className='flex items-center gap-2 text-primary font-semibold text-sm'>
          <Filter className='w-4 h-4 text-[#C86D51]' />
          Filter Data Laporan
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm'>
          {activeTab === 'payments' ? (
            <>
              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Status Verifikasi</label>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C86D51]'
                >
                  <option value=''>Semua Status</option>
                  <option value='verified'>Verified (Disetujui)</option>
                  <option value='pending'>Pending (Menunggu)</option>
                  <option value='rejected'>Rejected (Ditolak)</option>
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Metode Pembayaran</label>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C86D51]'
                >
                  <option value=''>Semua Metode</option>
                  <option value='cash'>Tunai / Cash</option>
                  <option value='transfer'>Transfer Bank</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Status Pesanan</label>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C86D51]'
                >
                  <option value=''>Semua Status Pesanan</option>
                  <option value='pending'>Pending</option>
                  <option value='processing'>Processing</option>
                  <option value='ready'>Ready</option>
                  <option value='completed'>Completed</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-primary/70 mb-1'>Status Pelunasan</label>
                <select
                  value={orderPaymentStatusFilter}
                  onChange={(e) => setOrderPaymentStatusFilter(e.target.value)}
                  className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C86D51]'
                >
                  <option value=''>Semua Pelunasan</option>
                  <option value='unpaid'>Unpaid (Belum Bayar)</option>
                  <option value='partial'>Partial (DP)</option>
                  <option value='paid'>Paid (Lunas)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className='block text-xs font-medium text-primary/70 mb-1'>Dari Tanggal</label>
            <input
              type='date'
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C86D51]'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-primary/70 mb-1'>Sampai Tanggal</label>
            <input
              type='date'
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className='w-full bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C86D51]'
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm'>
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className='bg-white rounded-2xl border border-secondary/20 overflow-hidden shadow-sm'>
        {loading ? (
          <div className='p-12 text-center text-primary/50 flex flex-col items-center justify-center gap-2'>
            <RefreshCw className='w-6 h-6 animate-spin text-[#C86D51]' />
            <p className='text-sm'>Memuat data laporan...</p>
          </div>
        ) : activeTab === 'payments' ? (
          filteredPayments.length === 0 ? (
            <div className='p-12 text-center text-primary/50'>
              <CreditCard className='w-10 h-10 mx-auto text-secondary/40 mb-2' />
              <p className='font-medium'>Belum ada transaksi pembayaran sesuai filter</p>
              <p className='text-xs mt-1'>Coba sesuaikan pilihan tanggal atau filter status di atas</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-quaternary border-b border-secondary/15 text-primary/70 text-xs font-bold uppercase tracking-wider'>
                  <tr>
                    <th className='px-5 py-4'>ID & Tanggal</th>
                    <th className='px-5 py-4'>No. Order</th>
                    <th className='px-5 py-4'>Metode / Rekening</th>
                    <th className='px-5 py-4'>Tipe</th>
                    <th className='px-5 py-4'>Nominal</th>
                    <th className='px-5 py-4'>Status</th>
                    <th className='px-5 py-4 text-center'>Bukti</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-secondary/10 text-primary'>
                  {filteredPayments.map((p) => {
                    const proofUrl = p.payment_proof
                      ? p.payment_proof.startsWith('http')
                        ? p.payment_proof
                        : `http://localhost:3000${p.payment_proof}`
                      : null;

                    return (
                      <tr key={p.id} className='hover:bg-secondary/5 transition'>
                        <td className='px-5 py-4'>
                          <span className='font-mono font-bold text-xs block text-primary/60'>
                            #PAY-{String(p.id).padStart(4, '0')}
                          </span>
                          <span className='text-xs text-primary/50 flex items-center gap-1 mt-0.5'>
                            <Calendar className='w-3 h-3' />
                            {formatDate(p.paid_at || p.created_at)}
                          </span>
                        </td>
                        <td className='px-5 py-4'>
                          <span className='font-semibold text-primary block'>
                            {p.order?.order_number || `Order #${p.order_id}`}
                          </span>
                          <span className='text-xs text-primary/60'>
                            Total Order: {formatIdr(p.order?.total_amount)}
                          </span>
                        </td>
                        <td className='px-5 py-4'>
                          <span className='capitalize font-medium block text-primary'>
                            {p.payment_method === 'transfer' ? 'Transfer Bank' : 'Tunai / Cash'}
                          </span>
                          {p.rekening && (
                            <span className='text-xs text-primary/60 flex items-center gap-1 mt-0.5'>
                              <Building2 className='w-3 h-3' />
                              {p.rekening.bank_name} ({p.rekening.account_number})
                            </span>
                          )}
                        </td>
                        <td className='px-5 py-4'>
                          <span className='text-xs uppercase font-semibold px-2 py-0.5 rounded bg-secondary/15 text-primary/80'>
                            {p.payment_type || 'full'}
                          </span>
                        </td>
                        <td className='px-5 py-4 font-bold text-primary'>
                          {formatIdr(p.amount)}
                        </td>
                        <td className='px-5 py-4'>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusBadge(
                              p.status
                            )}`}
                          >
                            {p.status || 'pending'}
                          </span>
                        </td>
                        <td className='px-5 py-4 text-center'>
                          {proofUrl ? (
                            <button
                              onClick={() => setPreviewImage(proofUrl)}
                              className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-[#C86D51] hover:text-white text-primary text-xs font-medium transition'
                              title='Lihat Bukti Transfer'
                            >
                              <ImageIcon className='w-3.5 h-3.5' />
                              Lihat Bukti
                            </button>
                          ) : (
                            <span className='text-xs text-primary/40 italic'>Tidak Ada</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredOrders.length === 0 ? (
            <div className='p-12 text-center text-primary/50'>
              <FileText className='w-10 h-10 mx-auto text-secondary/40 mb-2' />
              <p className='font-medium'>Belum ada pesanan pre-order sesuai filter</p>
              <p className='text-xs mt-1'>Coba sesuaikan pilihan tanggal atau filter di atas</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
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
                        {o.order_items?.length > 0 && (
                          <span className='block text-xs text-primary/50 font-normal mt-0.5'>
                            {o.order_items.length} jenis kue
                          </span>
                        )}
                      </td>
                      <td className='px-5 py-4'>
                        <span className='font-medium block text-primary'>
                          {o.customer?.name || o.Customer?.name || 'Customer Umum'}
                        </span>
                        <span className='text-xs text-primary/60'>
                          {o.customer?.phone || o.Customer?.phone || '-'}
                        </span>
                      </td>
                      <td className='px-5 py-4 text-xs text-primary/70'>
                        <div>
                          <span className='text-primary/40'>Pesan:</span> {formatDate(o.order_date || o.created_at)}
                        </div>
                        <div className='mt-0.5'>
                          <span className='text-primary/40'>Ambil:</span>{' '}
                          <strong className='text-primary'>
                            {o.pickup_date ? new Date(o.pickup_date).toLocaleDateString('id-ID') : '-'}
                          </strong>
                        </div>
                      </td>
                      <td className='px-5 py-4'>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getOrderStatusBadge(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className='px-5 py-4'>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                            o.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : o.payment_status === 'partial'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {o.payment_status || 'unpaid'}
                        </span>
                      </td>
                      <td className='px-5 py-4 text-right font-bold text-primary'>
                        {formatIdr(o.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Modal Preview Bukti Gambar */}
      {previewImage && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
          onClick={() => setPreviewImage(null)}
        >
          <div
            className='bg-white p-4 rounded-2xl max-w-lg w-full shadow-2xl space-y-3 relative'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between border-b border-secondary/20 pb-2'>
              <h3 className='font-bold text-primary flex items-center gap-2'>
                <ImageIcon className='w-4 h-4 text-[#C86D51]' />
                Bukti Pembayaran
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className='text-primary/50 hover:text-primary font-bold text-lg'
              >
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
              <button
                onClick={() => setPreviewImage(null)}
                className='px-4 py-2 bg-[#C86D51] text-white rounded-xl text-sm font-semibold hover:bg-[#C86D51]/90 transition'
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
