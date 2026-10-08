import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { materialService } from '../../services/materialService';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Sliders,
  History,
  Package,
} from 'lucide-react';

export default function MaterialDetailPage() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals for Usage and Adjustment
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [usageForm, setUsageForm] = useState({ quantity: '', notes: '' });
  const [usageLoading, setUsageLoading] = useState(false);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ quantity: '', notes: '' });
  const [adjustLoading, setAdjustLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [matRes, txRes] = await Promise.all([
        materialService.getById(id),
        materialService.getTransactions(id),
      ]);
      setMaterial(matRes.data || matRes);
      setTransactions(Array.isArray(txRes) ? txRes : txRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUsageSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUsageLoading(true);
    try {
      const qty = Number(usageForm.quantity);
      const currentStock = Number(material?.stock?.quantity || 0);
      if (qty <= 0) throw new Error('Quantity harus lebih besar dari 0');
      if (qty > currentStock) {
        throw new Error(`Stok tidak cukup. Stok saat ini: ${currentStock} ${material.unit}`);
      }

      await materialService.recordUsage(id, {
        quantity: qty,
        notes: usageForm.notes.trim() || undefined,
      });
      setSuccess('Pemakaian bahan berhasil dicatat');
      setIsUsageModalOpen(false);
      setUsageForm({ quantity: '', notes: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUsageLoading(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAdjustLoading(true);
    try {
      const qty = Number(adjustForm.quantity);
      if (qty === 0) throw new Error('Perubahan quantity tidak boleh 0');

      const currentStock = Number(material?.stock?.quantity || 0);
      const newStock = currentStock + qty;
      if (newStock < 0) {
        throw new Error(`Koreksi mengakibatkan stok negatif (${newStock} ${material.unit})`);
      }

      if (
        !window.confirm(
          `Stok akan berubah dari ${currentStock} ${material.unit} menjadi ${newStock} ${material.unit}. Lanjutkan?`
        )
      ) {
        setAdjustLoading(false);
        return;
      }

      await materialService.recordAdjustment(id, {
        quantity: qty,
        notes: adjustForm.notes.trim() || undefined,
      });
      setSuccess('Koreksi stok berhasil dicatat');
      setIsAdjustModalOpen(false);
      setAdjustForm({ quantity: '', notes: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdjustLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-primary/50">Memuat detail bahan baku...</div>;
  }

  if (!material) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-red-600 font-semibold">Material tidak ditemukan</p>
        <Link to="/materials" className="text-tertiary underline">
          Kembali ke daftar bahan baku
        </Link>
      </div>
    );
  }

  const currentStock = Number(material.stock?.quantity || 0);
  const minStock = Number(material.minimum_stock || 0);
  const isLow = currentStock <= minStock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/materials"
            className="text-sm text-tertiary hover:underline inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar Bahan
          </Link>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            {material.name}
            <span className="text-sm font-normal px-3 py-1 bg-secondary/10 rounded-full">
              {material.unit}
            </span>
          </h1>
          <p className="text-primary/60 text-sm mt-1">Detail informasi, status stok, dan histori transaksi</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setError('');
              setIsUsageModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition shadow-sm text-sm"
          >
            <PlusCircle size={16} />
            Gunakan Bahan
          </button>
          <button
            onClick={() => {
              setError('');
              setIsAdjustModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-tertiary text-primary rounded-lg font-semibold hover:bg-tertiary/90 transition shadow-sm text-sm"
          >
            <Sliders size={16} />
            Koreksi Stok
          </button>
        </div>
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

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <p className="text-sm text-primary/60">Stok Saat Ini</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {currentStock} <span className="text-lg font-normal text-primary/70">{material.unit}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <p className="text-sm text-primary/60">Minimum Stok</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {minStock} <span className="text-lg font-normal text-primary/70">{material.unit}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <p className="text-sm text-primary/60">Status Stok</p>
          <div className="mt-2">
            {isLow ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                <AlertTriangle size={16} />
                Stok Rendah
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <CheckCircle size={16} />
                Aman
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={20} className="text-primary/70" />
            <h2 className="text-lg font-bold text-primary">Histori Perubahan Stok</h2>
          </div>
          <span className="text-xs text-primary/60">Total {transactions.length} transaksi</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center text-primary/50">Belum ada histori transaksi untuk bahan ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
                <tr>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Tipe</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {transactions.map((tx) => {
                  const qty = Number(tx.quantity);
                  const isPositive = qty > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-quaternary/50 transition">
                      <td className="px-6 py-4 text-primary/80">
                        {new Date(tx.createdAt || tx.created_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            tx.type === 'PURCHASE'
                              ? 'bg-blue-100 text-blue-700'
                              : tx.type === 'USAGE'
                              ? 'bg-amber-100 text-amber-700'
                              : tx.type === 'RETURN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 font-bold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? `+${qty}` : qty} {material.unit}
                      </td>
                      <td className="px-6 py-4 text-primary/70">{tx.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Usage Modal */}
      {isUsageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative text-primary">
            <h2 className="text-lg font-bold mb-2">Gunakan Bahan Baku</h2>
            <p className="text-xs text-primary/60 mb-4">
              Stok saat ini: <strong className="text-primary">{currentStock} {material.unit}</strong>
            </p>
            <form onSubmit={handleUsageSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Quantity Dipakai ({material.unit}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  max={currentStock}
                  value={usageForm.quantity}
                  onChange={(e) => setUsageForm({ ...usageForm, quantity: e.target.value })}
                  required
                  placeholder="0"
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">Catatan / Keterangan</label>
                <textarea
                  value={usageForm.notes}
                  onChange={(e) => setUsageForm({ ...usageForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Misal: Dipunakan untuk produksi kue ulang tahun"
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsUsageModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={usageLoading}
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition shadow-sm disabled:opacity-50"
                >
                  {usageLoading ? 'Menyimpan...' : 'Catat Pemakaian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative text-primary">
            <h2 className="text-lg font-bold mb-2">Koreksi Stok (Stock Adjustment)</h2>
            <p className="text-xs text-primary/60 mb-4">
              Masukkan nilai positif untuk menambah stok atau nilai negatif untuk mengurangi stok.
            </p>
            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Perubahan Quantity (+ / -) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                  required
                  placeholder="Contoh: -1.5 atau 5"
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Alasan Koreksi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={adjustForm.notes}
                  onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })}
                  rows={3}
                  required
                  placeholder="Misal: Selisih hasil stock opname bulanan"
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm disabled:opacity-50"
                >
                  {adjustLoading ? 'Menyimpan...' : 'Simpan Koreksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
