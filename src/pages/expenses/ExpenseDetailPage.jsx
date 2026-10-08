import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { expenseService, expenseCategoryService } from '../../services/expenseService';
import { ArrowLeft, Edit, Trash2, ExternalLink } from 'lucide-react';

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
    month: 'long',
    year: 'numeric',
  });
};

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchExpense = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await expenseService.getById(id);
      setExpense(data.data || data);
      setEditForm({
        categoryId: (data.data || data).category_id,
        amount: (data.data || data).amount,
        expenseDate: (data.data || data).expense_date,
        description: (data.data || data).description,
        paymentMethod: (data.data || data).payment_method,
        receipt: (data.data || data).receipt || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await expenseCategoryService.getAll();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Gagal load kategori:', err);
    }
  };

  useEffect(() => {
    fetchExpense();
    fetchCategories();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await expenseService.update(id, editForm);
      setSuccess('Pengeluaran berhasil diperbarui');
      setIsEditing(false);
      fetchExpense();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan.')) return;
    setError('');
    try {
      await expenseService.delete(id);
      navigate('/expenses', { state: { message: 'Pengeluaran berhasil dihapus' } });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-primary/50">Memuat detail pengeluaran...</div>;
  }

  if (error && !expense) {
    return (
      <div className="space-y-4">
        <Link to="/expenses" className="text-sm text-tertiary hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!expense) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          to="/expenses"
          className="text-sm text-tertiary hover:underline inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-primary">Detail Pengeluaran</h1>
        <p className="text-primary/60 text-sm mt-1">Nomor: {expense.expense_number || `EXP-${expense.id}`}</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      {!isEditing ? (
        <div className="bg-white rounded-xl border border-secondary/20 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-secondary/10">
            <h2 className="text-lg font-bold text-primary">Informasi Pengeluaran</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-tertiary/20 text-primary hover:bg-tertiary/40 rounded transition text-xs font-semibold"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded transition text-xs font-semibold"
              >
                <Trash2 size={14} />
                Hapus
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div>
              <p className="text-primary/60 text-xs mb-1">Kategori</p>
              <p className="font-semibold text-primary">
                {expense.expense_category?.name || expense.category?.name || '-'}
              </p>
            </div>
            <div>
              <p className="text-primary/60 text-xs mb-1">Jumlah</p>
              <p className="font-bold text-primary text-xl">{formatPrice(expense.amount)}</p>
            </div>
            <div>
              <p className="text-primary/60 text-xs mb-1">Tanggal</p>
              <p className="font-semibold text-primary">{formatDate(expense.expense_date)}</p>
            </div>
            <div>
              <p className="text-primary/60 text-xs mb-1">Metode Pembayaran</p>
              <p className="font-semibold text-primary capitalize">{expense.payment_method}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-primary/60 text-xs mb-1">Deskripsi</p>
              <p className="text-primary">{expense.description}</p>
            </div>
            {expense.receipt && (
              <div className="md:col-span-2">
                <p className="text-primary/60 text-xs mb-1">Bukti / Receipt</p>
                <a
                  href={expense.receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-tertiary hover:underline text-sm"
                >
                  Lihat Bukti <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="bg-white rounded-xl border border-secondary/20 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-secondary/10">
            <h2 className="text-lg font-bold text-primary">Edit Pengeluaran</h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">Kategori</label>
            <select
              value={editForm.categoryId}
              onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
              required
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              step="any"
              min="0"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              required
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">Tanggal</label>
            <input
              type="date"
              value={editForm.expenseDate}
              onChange={(e) => setEditForm({ ...editForm, expenseDate: e.target.value })}
              required
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">Deskripsi</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              required
              rows={3}
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">Metode Pembayaran</label>
            <select
              value={editForm.paymentMethod}
              onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
            >
              <option value="CASH">Cash</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">Bukti / Receipt</label>
            <input
              type="text"
              value={editForm.receipt}
              onChange={(e) => setEditForm({ ...editForm, receipt: e.target.value })}
              placeholder="URL atau path"
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-secondary/15">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
