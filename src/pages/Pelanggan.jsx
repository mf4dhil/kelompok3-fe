import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  Users,
  ShoppingBag,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { customersService, ordersService } from '../services/orderService';

const LIMIT = 10;

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const EMPTY_FORM = { name: '', phone: '', email: '', address: '' };

export default function Pelanggan() {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      const res = await customersService.getAll(params);
      const list = Array.isArray(res) ? res : res.data || [];
      setCustomers(list);
      setTotalItems(res.totalItems ?? list.length);
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      setCustomers([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderCount = async () => {
    try {
      const res = await ordersService.getAll({ limit: 1 });
      setTotalOrders(res.totalItems ?? (Array.isArray(res) ? res.length : res.data?.length ?? 0));
    } catch {
      setTotalOrders(null);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  useEffect(() => {
    fetchOrderCount();
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
    };
    try {
      if (editingId) {
        await customersService.update(editingId, payload);
        setSuccess('Pelanggan berhasil diperbarui');
      } else {
        await customersService.create(payload);
        setSuccess('Pelanggan berhasil ditambahkan');
      }
      setFormOpen(false);
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    clearMessages();
    try {
      await customersService.delete(deleteId);
      setSuccess('Pelanggan berhasil dihapus');
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pelanggan</h1>
          <p className="text-primary/60 text-sm mt-1">
            Kelola data pelanggan dan lihat riwayat pesanan.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary text-primary rounded-lg font-semibold hover:bg-tertiary/90 transition shadow-sm text-sm"
        >
          <Plus size={16} />
          Tambah Pelanggan
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Pelanggan"
          value={totalItems}
          icon={<Users className="w-6 h-6 text-tertiary" />}
          bgClass="bg-tertiary/15"
        />
        <StatCard
          title="Total Pesanan"
          value={totalOrders ?? '-'}
          icon={<ShoppingBag className="w-6 h-6 text-secondary" />}
          bgClass="bg-secondary/15"
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-secondary/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau nomor HP..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/10 border border-secondary/25 rounded-lg text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
              <tr>
                <th className="px-5 py-3 w-12">No</th>
                <th className="px-5 py-3">Pelanggan</th>
                <th className="px-5 py-3">No. HP</th>
                <th className="px-5 py-3">Alamat</th>
                <th className="px-5 py-3 text-center w-64">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-primary/50">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memuat data pelanggan...
                    </span>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-primary/50">
                    {search ? 'Pelanggan tidak ditemukan.' : 'Belum ada data pelanggan.'}
                  </td>
                </tr>
              ) : (
                customers.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-quaternary/50 transition">
                    <td className="px-5 py-4 text-primary/70">
                      {(page - 1) * LIMIT + index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-primary font-semibold">
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-primary">{customer.name}</p>
                          <p className="text-xs text-primary/60">{customer.email || '-'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-primary/80">{customer.phone}</td>

                    <td className="px-5 py-4 text-primary/80 max-w-xs truncate">
                      {customer.address || '-'}
                    </td>

                    <td className="px-5 py-4">
                      {deleteId === customer.id ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-xs text-primary/70 mr-1">Hapus pelanggan ini?</span>
                          <button
                            onClick={confirmDelete}
                            className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded transition text-xs font-semibold"
                          >
                            Ya, hapus
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="px-3 py-1.5 border border-secondary/25 text-primary hover:bg-secondary/10 rounded transition text-xs font-semibold"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary/15 text-primary hover:bg-secondary/25 rounded transition text-xs font-semibold"
                          >
                            <Eye size={14} />
                            Detail
                          </button>
                          <button
                            onClick={() => openEdit(customer)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-tertiary/20 text-primary hover:bg-tertiary/40 rounded transition text-xs font-semibold"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(customer.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded transition text-xs font-semibold"
                          >
                            <Trash2 size={14} />
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-secondary/20 text-sm">
            <span className="text-primary/70">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-secondary/25 rounded disabled:opacity-40 hover:bg-secondary/10 transition"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-secondary/25 rounded disabled:opacity-40 hover:bg-secondary/10 transition"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl text-primary max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <Field label="Nama" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                  placeholder="Nama lengkap"
                  className={inputClass}
                />
              </Field>
              <Field label="No. HP" required>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  placeholder="08xxxxxxxxxx"
                  className={inputClass}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@contoh.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Alamat">
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  placeholder="Alamat lengkap (opsional)"
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <div className="flex justify-end gap-2 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

const inputClass =
  'w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-primary/70 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function StatCard({ title, value, icon, bgClass }) {
  return (
    <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary/60">{title}</p>
          <h2 className="text-2xl font-bold text-primary mt-1">{value}</h2>
        </div>
        <div className={`p-3 rounded-lg ${bgClass}`}>{icon}</div>
      </div>
    </div>
  );
}

// Detail pelanggan: ambil detail + riwayat order dari endpoint orders (filter customer_id)
function CustomerDetailModal({ customer, onClose }) {
  const [detail, setDetail] = useState(customer);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [cust, ordRes] = await Promise.all([
          customersService.getById(customer.id),
          ordersService.getAll({ customer_id: customer.id }),
        ]);
        if (cancelled) return;
        setDetail(cust.data || cust);
        const list = Array.isArray(ordRes) ? ordRes : ordRes.data || [];
        setOrders(list);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [customer.id]);

  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary/20">
          <div>
            <h2 className="text-lg font-bold text-primary">Detail Pelanggan</h2>
            <p className="text-sm text-primary/60">Informasi pelanggan dan riwayat pesanan</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 rounded-lg hover:bg-secondary/10 text-primary/60 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-tertiary/20 flex items-center justify-center text-primary text-xl font-bold">
              {detail.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">{detail.name}</h3>
              <p className="text-sm text-primary/60">{detail.phone}</p>
              <p className="text-sm text-primary/60">{detail.email || '-'}</p>
              <p className="text-sm text-primary/60">{detail.address || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-secondary/10 rounded-lg p-4">
              <p className="text-sm text-primary/60">Total Pesanan</p>
              <p className="text-xl font-bold text-primary mt-1">{loading ? '...' : orders.length}</p>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4">
              <p className="text-sm text-primary/60">Total Belanja</p>
              <p className="text-xl font-bold text-primary mt-1">
                {loading ? '...' : formatPrice(totalSpent)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Riwayat Pesanan</h3>

            {loading ? (
              <div className="py-8 text-center text-primary/50">Memuat riwayat pesanan...</div>
            ) : error ? (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center text-primary/50 border border-secondary/20 rounded-lg">
                Belum ada riwayat pesanan untuk pelanggan ini.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-secondary/20 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-primary">{order.order_number}</p>
                        <p className="text-xs text-primary/60">
                          Pickup: {formatDate(order.pickup_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/15 text-primary capitalize">
                          {order.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            order.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : order.payment_status === 'partial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                        <span className="font-semibold text-primary">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(order.order_items || order.OrderItems || []).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-secondary/10 rounded-lg p-3 text-sm"
                        >
                          <span className="text-primary">
                            {item.ProductVariant?.Product?.name || 'Produk'}
                          </span>
                          <span className="text-primary/70">
                            x{item.quantity} · {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
