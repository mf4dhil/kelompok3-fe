import React, { useState, useEffect } from 'react';
import { ordersService, customersService } from '../services/orderService';
import { rekeningsService } from '../services/masterDataService';
import { getProducts } from '../services/productService';

export default function PreOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rekenings, setRekenings] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_id: '',
    pickup_date: '',
    notes: '',
    payment_method: 'cash',
    rekening_id: '',
    items: [{ product_variant_id: '', quantity: 1, notes: '' }],
  });

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({ id: null, status: 'pending' });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    id: null,
    payment_status: 'unpaid',
    payment_method: 'cash',
    rekening_id: '',
    payment_proof: '',
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.payment_status = paymentFilter;

      const res = await ordersService.getAll(params);
      // Handle pagination or array response
      const list = Array.isArray(res) ? res : res.data || res.orders || [];
      setOrders(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportingData = async () => {
    try {
      const [custRes, rekRes, prodRes] = await Promise.all([
        customersService.getAll(),
        rekeningsService.getAll({ is_active: true }),
        getProducts(),
      ]);
      setCustomers(Array.isArray(custRes) ? custRes : custRes.data || []);
      setRekenings(Array.isArray(rekRes) ? rekRes : rekRes.data || []);
      setProducts(Array.isArray(prodRes) ? prodRes : prodRes.data || []);
    } catch (err) {
      console.error('Gagal mengambil data pendukung:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSupportingData();
  }, [statusFilter, paymentFilter]);

  // Handle Create Order Form
  const handleAddItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { product_variant_id: '', quantity: 1, notes: '' }],
    }));
  };

  const handleRemoveItem = (index) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewOrder((prev) => {
      const updated = [...prev.items];
      updated[index][field] = value;
      return { ...prev, items: updated };
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        customer_id: parseInt(newOrder.customer_id),
        pickup_date: newOrder.pickup_date,
        notes: newOrder.notes,
        payment_method: newOrder.payment_method,
        rekening_id: newOrder.payment_method === 'transfer' ? parseInt(newOrder.rekening_id) : null,
        items: newOrder.items.map((item) => ({
          product_variant_id: parseInt(item.product_variant_id),
          quantity: parseInt(item.quantity),
          notes: item.notes,
        })),
      };

      await ordersService.create(payload);
      setSuccess('Order berhasil dibuat');
      setIsCreateModalOpen(false);
      setNewOrder({
        customer_id: '',
        pickup_date: '',
        notes: '',
        payment_method: 'cash',
        rekening_id: '',
        items: [{ product_variant_id: '', quantity: 1, notes: '' }],
      });
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  // Status Update
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await ordersService.updateStatus(statusForm.id, statusForm.status);
      setSuccess('Status order berhasil diperbarui');
      setIsStatusModalOpen(false);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  // Payment Update
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        payment_status: paymentForm.payment_status,
        payment_method: paymentForm.payment_method,
        rekening_id: paymentForm.payment_method === 'transfer' ? parseInt(paymentForm.rekening_id) : null,
        payment_proof: paymentForm.payment_proof,
      };
      await ordersService.updatePayment(paymentForm.id, payload);
      setSuccess('Status pembayaran berhasil diperbarui');
      setIsPaymentModalOpen(false);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Order
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus order ini?')) return;
    setError('');
    setSuccess('');
    try {
      await ordersService.delete(id);
      setSuccess('Order berhasil dihapus');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);

  // Flatten available variants for select dropdown
  const allVariants = [];
  products.forEach((prod) => {
    if (prod.productvariants) {
      prod.productvariants.forEach((v) => {
        allVariants.push({
          id: v.id,
          name: `${prod.name} (${v.shape?.name || ''} - ${v.size?.name || ''} - ${v.flavor?.name || ''}) - ${formatCurrency(v.price)}`,
        });
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manajemen Pre-Orders</h1>
          <p className="text-primary/60 text-sm">Kelola daftar pesanan kue masuk</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-tertiary text-primary rounded-lg font-semibold hover:bg-tertiary/90 transition shadow-sm text-sm"
        >
          + Buat Order Baru
        </button>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm">{error}</div>}
      {success && <div className="p-4 rounded-lg bg-green-100 border border-green-200 text-green-700 text-sm">{success}</div>}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-secondary/20 flex flex-wrap gap-4 items-center shadow-sm">
        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">Status Order</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-secondary/10 border border-secondary/25 rounded-lg px-3 py-1.5 text-sm text-primary focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">Status Pembayaran</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-secondary/10 border border-secondary/25 rounded-lg px-3 py-1.5 text-sm text-primary focus:outline-none"
          >
            <option value="">Semua Pembayaran</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-primary/50">Memuat data orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-primary/50">Belum ada order.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
                <tr>
                  <th className="px-5 py-3">No. Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Tanggal Pickup</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Pembayaran</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-quaternary/50 transition">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-primary">{order.order_number}</td>
                    <td className="px-5 py-4 font-medium text-primary">{order.Customer?.name || order.customer?.name || '-'}</td>
                    <td className="px-5 py-4 text-primary/80">{order.pickup_date}</td>
                    <td className="px-5 py-4 font-semibold text-primary">{formatCurrency(order.total_amount)}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-primary capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : order.payment_status === 'partial'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-secondary/20 text-primary hover:bg-secondary/30 rounded transition text-xs font-semibold"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => {
                          setStatusForm({ id: order.id, status: order.status });
                          setIsStatusModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-tertiary/20 text-primary hover:bg-tertiary/40 rounded transition text-xs font-semibold"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => {
                          setPaymentForm({
                            id: order.id,
                            payment_status: order.payment_status,
                            payment_method: order.payment_method || 'cash',
                            rekening_id: order.rekening_id || '',
                            payment_proof: order.payment_proof || '',
                          });
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition text-xs font-semibold"
                      >
                        Bayar
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="px-2.5 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition text-xs font-semibold"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: DETAIL ORDER */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative text-primary max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Detail Order #{selectedOrder.order_number}</h2>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 bg-quaternary p-3 rounded-lg">
                <div>
                  <p className="text-xs text-primary/60">Customer</p>
                  <p className="font-semibold">{selectedOrder.Customer?.name || selectedOrder.customer?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-primary/60">No. Telepon</p>
                  <p className="font-semibold">{selectedOrder.Customer?.phone || selectedOrder.customer?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-primary/60">Tanggal Pickup</p>
                  <p className="font-semibold">{selectedOrder.pickup_date}</p>
                </div>
                <div>
                  <p className="text-xs text-primary/60">Total Amount</p>
                  <p className="font-semibold text-tertiary">{formatCurrency(selectedOrder.total_amount)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary/70 mb-1">Items Pesanan:</p>
                <div className="border border-secondary/20 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-quaternary">
                      <tr>
                        <th className="px-3 py-2 text-left">Produk Varian</th>
                        <th className="px-3 py-2 text-center">Qty</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {(selectedOrder.OrderItems || selectedOrder.order_items || []).map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">
                            {item.ProductVariant?.Product?.name || item.product_variant?.product?.name || 'Kue Varian'}
                          </td>
                          <td className="px-3 py-2 text-center">{item.quantity}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-xs font-semibold text-primary/70 mb-1">Catatan:</p>
                  <p className="bg-secondary/10 p-2.5 rounded-lg text-xs">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-secondary/10">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-tertiary text-primary text-sm font-semibold rounded-lg hover:bg-tertiary/90 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ORDER */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative text-primary max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Buat Order Pre-Order Baru</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-primary/70 mb-1">Customer <span className="text-red-500">*</span></label>
                  <select
                    value={newOrder.customer_id}
                    onChange={(e) => setNewOrder({ ...newOrder, customer_id: e.target.value })}
                    required
                    className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-tertiary"
                  >
                    <option value="">-- Pilih Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary/70 mb-1">Tanggal Pickup <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={newOrder.pickup_date}
                    onChange={(e) => setNewOrder({ ...newOrder, pickup_date: e.target.value })}
                    required
                    className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-tertiary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-primary/70 mb-1">Metode Pembayaran</label>
                  <select
                    value={newOrder.payment_method}
                    onChange={(e) => setNewOrder({ ...newOrder, payment_method: e.target.value })}
                    className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-tertiary"
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                {newOrder.payment_method === 'transfer' && (
                  <div>
                    <label className="block text-xs font-medium text-primary/70 mb-1">Rekening Tujuan <span className="text-red-500">*</span></label>
                    <select
                      value={newOrder.rekening_id}
                      onChange={(e) => setNewOrder({ ...newOrder, rekening_id: e.target.value })}
                      required
                      className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-tertiary"
                    >
                      <option value="">-- Pilih Rekening --</option>
                      {rekenings.map((r) => (
                        <option key={r.id} value={r.id}>{r.bank_name} - {r.account_number} ({r.account_name})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-primary/70">Items Kue <span className="text-red-500">*</span></label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 bg-tertiary/20 text-primary rounded text-xs font-semibold hover:bg-tertiary/30"
                  >
                    + Tambah Item
                  </button>
                </div>
                <div className="space-y-2">
                  {newOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-quaternary p-2 rounded-lg">
                      <select
                        value={item.product_variant_id}
                        onChange={(e) => handleItemChange(idx, 'product_variant_id', e.target.value)}
                        required
                        className="flex-1 bg-white border border-secondary/25 rounded py-1.5 px-2 text-xs focus:outline-none"
                      >
                        <option value="">-- Pilih Varian Kue --</option>
                        {allVariants.map((v) => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        required
                        placeholder="Qty"
                        className="w-16 bg-white border border-secondary/25 rounded py-1.5 px-2 text-xs text-center focus:outline-none"
                      />
                      {newOrder.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">Catatan Order</label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  rows={2}
                  placeholder="Catatan tambahan..."
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm"
                >
                  Simpan Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE STATUS */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative text-primary">
            <h2 className="text-lg font-bold mb-4">Update Status Order</h2>
            <form onSubmit={handleStatusSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE PAYMENT */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative text-primary">
            <h2 className="text-lg font-bold mb-4">Update Pembayaran</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">Status Pembayaran</label>
                <select
                  value={paymentForm.payment_status}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_status: e.target.value })}
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">Metode Pembayaran</label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              {paymentForm.payment_method === 'transfer' && (
                <div>
                  <label className="block text-xs font-medium text-primary/70 mb-1">Rekening Tujuan</label>
                  <select
                    value={paymentForm.rekening_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, rekening_id: e.target.value })}
                    className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none"
                  >
                    <option value="">-- Pilih Rekening --</option>
                    {rekenings.map((r) => (
                      <option key={r.id} value={r.id}>{r.bank_name} - {r.account_number}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">URL Bukti Pembayaran (Opsional)</label>
                <input
                  type="text"
                  value={paymentForm.payment_proof}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_proof: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm"
                >
                  Update Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
