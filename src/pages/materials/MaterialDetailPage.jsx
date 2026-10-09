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
  Plus,
  Edit,
  Trash2,
  Scale,
} from 'lucide-react';

export default function MaterialDetailPage() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [units, setUnits] = useState([]);
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

  // Modal for Material Unit (Create / Edit)
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitForm, setUnitForm] = useState({ name: '', conversion_factor: '', is_active: true });
  const [unitLoading, setUnitLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [matRes, txRes, unitRes] = await Promise.all([
        materialService.getById(id),
        materialService.getTransactions(id),
        materialService.getUnits(id),
      ]);
      setMaterial(matRes.data || matRes);
      setTransactions(Array.isArray(txRes) ? txRes : txRes.data || []);
      setUnits(Array.isArray(unitRes) ? unitRes : unitRes.data || []);
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

  // Handler Unit Modal
  const openAddUnitModal = () => {
    setEditingUnit(null);
    setUnitForm({ name: '', conversion_factor: '', is_active: true });
    setIsUnitModalOpen(true);
  };

  const openEditUnitModal = (u) => {
    setEditingUnit(u);
    setUnitForm({
      name: u.name,
      conversion_factor: u.conversion_factor,
      is_active: u.is_active !== undefined ? u.is_active : true,
    });
    setIsUnitModalOpen(true);
  };

  const handleUnitSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUnitLoading(true);
    try {
      const factor = Number(unitForm.conversion_factor);
      if (!unitForm.name.trim()) throw new Error('Nama satuan wajib diisi');
      if (isNaN(factor) || factor <= 0) throw new Error('Faktor konversi harus lebih dari 0');

      if (editingUnit) {
        await materialService.updateUnit(id, editingUnit.id, {
          name: unitForm.name.trim(),
          conversion_factor: factor,
          is_active: unitForm.is_active,
        });
        setSuccess('Satuan beli berhasil diperbarui');
      } else {
        await materialService.createUnit(id, {
          name: unitForm.name.trim(),
          conversion_factor: factor,
        });
        setSuccess('Satuan beli baru berhasil ditambahkan');
      }

      setIsUnitModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUnitLoading(false);
    }
  };

  const handleDeleteUnit = async (u) => {
    if (u.is_base) {
      alert('Satuan dasar tidak boleh dihapus atau dinonaktifkan.');
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus / menonaktifkan satuan "${u.name}"?`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await materialService.deleteUnit(id, u.id);
      setSuccess(res.message || 'Satuan berhasil dihapus / dinonaktifkan');
      fetchData();
    } catch (err) {
      setError(err.message);
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
              Dasar: {material.unit}
            </span>
          </h1>
          <p className="text-primary/60 text-sm mt-1">Detail informasi, satuan beli & konversi, serta histori transaksi</p>
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
          <p className="text-sm text-primary/60">Stok Saat Ini (Satuan Dasar)</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {currentStock.toLocaleString('id-ID', { maximumFractionDigits: 4 })}{' '}
            <span className="text-lg font-normal text-primary/70">{material.unit}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <p className="text-sm text-primary/60">Minimum Stok</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {minStock.toLocaleString('id-ID', { maximumFractionDigits: 4 })}{' '}
            <span className="text-lg font-normal text-primary/70">{material.unit}</span>
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

      {/* Satuan Beli & Konversi (LANGKAH 2 CRUD) */}
      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale size={20} className="text-primary/70" />
            <div>
              <h2 className="text-lg font-bold text-primary">Satuan Beli & Konversi</h2>
              <p className="text-xs text-primary/60 mt-0.5">
                Pilihan satuan kemasan pembelian untuk dikonversi otomatis ke satuan dasar ({material.unit})
              </p>
            </div>
          </div>
          <button
            onClick={openAddUnitModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-tertiary text-primary rounded-lg text-xs font-semibold hover:bg-tertiary/90 transition shadow-sm"
          >
            <Plus size={14} />
            Tambah Satuan Beli
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
              <tr>
                <th className="px-6 py-3">Nama Satuan</th>
                <th className="px-6 py-3">Faktor Konversi ke Satuan Dasar</th>
                <th className="px-6 py-3 text-center">Tipe Satuan</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-quaternary/50 transition">
                  <td className="px-6 py-4 font-semibold text-primary">{u.name}</td>
                  <td className="px-6 py-4 text-primary/80">
                    1 {u.name} = <strong>{Number(u.conversion_factor).toLocaleString('id-ID', { maximumFractionDigits: 4 })}</strong> {material.unit}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {u.is_base ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        Satuan Dasar
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Satuan Kemasan/Beli
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {u.is_active ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditUnitModal(u)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-tertiary/20 text-primary hover:bg-tertiary/40 rounded transition text-xs font-semibold"
                    >
                      <Edit size={13} />
                      Ubah
                    </button>
                    {!u.is_base && (
                      <button
                        onClick={() => handleDeleteUnit(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition text-xs font-semibold"
                        title="Hapus / Nonaktifkan"
                      >
                        <Trash2 size={13} />
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <th className="px-6 py-3">Quantity ({material.unit})</th>
                  <th className="px-6 py-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {transactions.map((tx) => {
                  const qty = Number(tx.quantity);
                  const isPositive = qty > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-quaternary/50 transition">
                      <td className="px-6 py-4 text-primary/70">
                        {new Date(tx.created_at || tx.createdAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            tx.type === 'PURCHASE'
                              ? 'bg-green-100 text-green-700'
                              : tx.type === 'USAGE'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
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
                        {isPositive ? `+${qty.toLocaleString('id-ID', { maximumFractionDigits: 4 })}` : qty.toLocaleString('id-ID', { maximumFractionDigits: 4 })}{' '}
                        {material.unit}
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

      {/* Modal Unit Form (Create/Edit) */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-primary">
              {editingUnit ? 'Ubah Satuan Beli' : 'Tambah Satuan Beli Baru'}
            </h3>
            <p className="text-xs text-primary/60">
              Tentukan satuan pembelian dan berapa pengalinya ke satuan dasar ({material.unit}).
            </p>

            <form onSubmit={handleUnitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Nama Satuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={unitForm.name}
                  onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                  placeholder="Misal: Bungkus 250 g, kg, Lusin, Dus"
                  required
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Faktor Konversi ke {material.unit} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  disabled={editingUnit?.is_base}
                  value={unitForm.conversion_factor}
                  onChange={(e) => setUnitForm({ ...unitForm, conversion_factor: e.target.value })}
                  placeholder={`Berapa ${material.unit} dalam 1 satuan ini?`}
                  required
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-primary/60 mt-1">
                  Contoh: Jika satuan adalah "Bungkus 250 g", masukkan <strong>250</strong> (karena 1 bungkus = 250 {material.unit}).
                </p>
              </div>

              {editingUnit && !editingUnit.is_base && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="unit_active"
                    checked={unitForm.is_active}
                    onChange={(e) => setUnitForm({ ...unitForm, is_active: e.target.checked })}
                    className="rounded border-secondary/25 text-tertiary focus:ring-tertiary"
                  />
                  <label htmlFor="unit_active" className="text-xs font-medium text-primary/80">
                    Satuan aktif (tersedia di form pembelian)
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={unitLoading}
                  className="px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm disabled:opacity-50"
                >
                  {unitLoading ? 'Menyimpan...' : 'Simpan Satuan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Penggunaan Bahan */}
      {isUsageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-primary">Gunakan Bahan</h3>
            <p className="text-xs text-primary/60">
              Catat pemakaian bahan baku untuk proses produksi. Stok saat ini: <strong>{currentStock} {material.unit}</strong>
            </p>

            <form onSubmit={handleUsageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Jumlah Digunakan ({material.unit}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  max={currentStock}
                  value={usageForm.quantity}
                  onChange={(e) => setUsageForm({ ...usageForm, quantity: e.target.value })}
                  placeholder="0"
                  required
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">Catatan</label>
                <textarea
                  value={usageForm.notes}
                  onChange={(e) => setUsageForm({ ...usageForm, notes: e.target.value })}
                  rows={2}
                  placeholder="Misal: Pembuatan 10 kue bolu"
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
                  {usageLoading ? 'Menyimpan...' : 'Simpan Pemakaian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Koreksi Stok */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-primary">Koreksi Stok Bahan</h3>
            <p className="text-xs text-primary/60">
              Gunakan angka positif untuk menambah stok atau angka negatif untuk mengurangi stok.
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Perubahan Quantity ({material.unit}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                  placeholder="Contoh: 5 atau -2.5"
                  required
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                />
                {adjustForm.quantity && (
                  <p className="text-xs text-primary/60 mt-1">
                    Stok baru:{' '}
                    <strong>
                      {(currentStock + Number(adjustForm.quantity || 0)).toLocaleString('id-ID', { maximumFractionDigits: 4 })}{' '}
                      {material.unit}
                    </strong>
                  </p>
                )}
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
