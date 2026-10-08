import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { expenseService, expenseCategoryService } from '../../services/expenseService';
import { ArrowLeft } from 'lucide-react';

export default function ExpenseCreatePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    categoryId: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'CASH',
    receipt: '',
  });

  const fetchCategories = async () => {
    try {
      const data = await expenseCategoryService.getAll();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Gagal load kategori:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!form.categoryId) throw new Error('Kategori wajib dipilih');
      if (Number(form.amount) <= 0) throw new Error('Amount harus lebih besar dari 0');
      if (!form.description.trim()) throw new Error('Deskripsi wajib diisi');

      const payload = {
        categoryId: parseInt(form.categoryId),
        amount: Number(form.amount),
        expenseDate: form.expenseDate,
        description: form.description.trim(),
        paymentMethod: form.paymentMethod,
        receipt: form.receipt.trim() || undefined,
      };

      await expenseService.create(payload);
      setSuccess('Pengeluaran berhasil dicatat');
      setTimeout(() => {
        navigate('/expenses');
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link
          to="/expenses"
          className="text-sm text-tertiary hover:underline inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-primary">Catat Pengeluaran Baru</h1>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-secondary/20 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
          >
            <option value="">Pilih kategori pengeluaran</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              Belum ada kategori. <Link to="/expense-categories" className="underline">Tambahkan kategori</Link>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">
            Jumlah (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            placeholder="0"
            className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
          />
          {form.amount && Number(form.amount) > 0 && (
            <p className="text-xs text-primary/60 mt-1">{formatPrice(form.amount)}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">
            Tanggal <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.expenseDate}
            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
            required
            className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">
            Deskripsi / Keterangan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            placeholder="Jelaskan pengeluaran ini..."
            className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">
            Metode Pembayaran <span className="text-red-500">*</span>
          </label>
          <select
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
          >
            <option value="CASH">Cash</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">
            Bukti / Receipt (URL atau Path)
          </label>
          <input
            type="text"
            value={form.receipt}
            onChange={(e) => setForm({ ...form, receipt: e.target.value })}
            placeholder="https://... atau /uploads/..."
            className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-secondary/15">
          <Link
            to="/expenses"
            className="px-5 py-2.5 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Pengeluaran'}
          </button>
        </div>
      </form>
    </div>
  );
}
