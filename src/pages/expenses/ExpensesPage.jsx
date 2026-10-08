import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expenseService, expenseCategoryService } from '../../services/expenseService';
import { Plus, Eye, Search } from 'lucide-react';

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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      const data = await expenseCategoryService.getAll();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Gagal load kategori:', err);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (search) params.search = search;
      const data = await expenseService.getAll(params);
      setExpenses(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pengeluaran</h1>
          <p className="text-primary/60 text-sm">Catat dan pantau pengeluaran atau uang keluar</p>
        </div>
        <Link
          to="/expenses/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary text-primary rounded-lg font-semibold hover:bg-tertiary/90 transition shadow-sm text-sm"
        >
          <Plus size={16} />
          Catat Pengeluaran
        </Link>
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

      {/* Filters */}
      <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input
              type="text"
              placeholder="Cari deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/10 border border-secondary/25 rounded-lg text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-primary/50">Memuat data pengeluaran...</div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center text-primary/50">
            {search || selectedCategory ? 'Tidak ada pengeluaran yang sesuai filter.' : 'Belum ada data pengeluaran.'}
            <div className="mt-3">
              {!search && !selectedCategory && (
                <Link
                  to="/expenses/create"
                  className="text-tertiary font-semibold text-sm hover:underline"
                >
                  Catat pengeluaran pertama →
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
                <tr>
                  <th className="px-6 py-3">No. Expense</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Deskripsi</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Metode</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-quaternary/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-primary/70">
                      {item.expense_number || `EXP-${item.id}`}
                    </td>
                    <td className="px-6 py-4 text-primary/80">{formatDate(item.expense_date)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/15 text-primary">
                        {item.expense_category?.name || item.category?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary/70 max-w-xs truncate">{item.description || '-'}</td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      {formatPrice(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/15 text-primary capitalize">
                        {item.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/expenses/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary/20 text-primary hover:bg-tertiary/40 rounded transition text-xs font-semibold"
                      >
                        <Eye size={14} />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
