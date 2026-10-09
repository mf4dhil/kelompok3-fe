import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materialService } from '../../services/materialService';
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Layers,
  Search,
  Package,
  XCircle,
} from 'lucide-react';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pencarian
  const [searchQuery, setSearchQuery] = useState('');

  // State modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    minimum_stock: 0,
    is_active: true,
  });

  const fetchMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await materialService.getAll();
      setMaterials(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      name: '',
      unit: 'kg',
      minimum_stock: 0,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      unit: item.unit,
      minimum_stock: item.minimum_stock,
      is_active: item.is_active !== undefined ? item.is_active : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: form.name.trim(),
        unit: form.unit.trim(),
        minimum_stock: Number(form.minimum_stock),
        is_active: form.is_active,
      };
      if (editingItem) {
        await materialService.update(editingItem.id, payload);
        setSuccess('Bahan baku berhasil diperbarui');
      } else {
        await materialService.create(payload);
        setSuccess('Bahan baku berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchMaterials();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus atau menonaktifkan bahan baku ini?')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await materialService.delete(id);
      setSuccess(res.message || 'Bahan baku berhasil dihapus');
      fetchMaterials();
    } catch (err) {
      setError(err.message);
    }
  };

  // Ringkasan data
  const totalMaterials = materials.length;

  const lowStockMaterials = materials.filter((item) => {
    const currentStock = Number(item.stock?.quantity || 0);
    const minStock = Number(item.minimum_stock || 0);
    return currentStock > 0 && currentStock <= minStock;
  }).length;

  const emptyStockMaterials = materials.filter((item) => {
    const currentStock = Number(item.stock?.quantity || 0);
    return currentStock <= 0;
  }).length;

  const safeStockMaterials = materials.filter((item) => {
    const currentStock = Number(item.stock?.quantity || 0);
    const minStock = Number(item.minimum_stock || 0);
    return currentStock > minStock;
  }).length;

  // Filter pencarian
  const filteredMaterials = materials.filter((item) => {
    const keyword = searchQuery.toLowerCase().trim();
    if (!keyword) return true;
    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.unit?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manajemen Bahan Baku</h1>
          <p className="text-primary/60 text-sm">
            Kelola daftar bahan baku dan pantau stok gudang
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/materials/low-stock"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition text-sm"
          >
            <AlertTriangle size={16} />
            Stok Rendah
          </Link>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary text-primary rounded-lg font-semibold hover:bg-tertiary/90 transition shadow-sm text-sm"
          >
            <Plus size={16} />
            Tambah Bahan
          </button>
        </div>
      </div>

      {/* Alert */}
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

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary/60">Total Bahan Baku</p>
              <h3 className="text-2xl font-bold text-primary mt-2">{totalMaterials}</h3>
              <p className="text-xs text-primary/50 mt-1">Semua bahan terdaftar</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-secondary/15 flex items-center justify-center">
              <Package size={21} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Stok aman */}
        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary/60">Stok Aman</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">{safeStockMaterials}</h3>
              <p className="text-xs text-primary/50 mt-1">Di atas minimum stok</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle size={21} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Stok menipis */}
        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary/60">Stok Menipis</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-2">{lowStockMaterials}</h3>
              <p className="text-xs text-primary/50 mt-1">Perlu segera diperhatikan</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={21} className="text-amber-600" />
            </div>
          </div>
        </div>

        {/* Stok habis */}
        <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary/60">Stok Habis</p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">{emptyStockMaterials}</h3>
              <p className="text-xs text-primary/50 mt-1">Perlu dilakukan restock</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle size={21} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pencarian */}
      <div className="bg-white rounded-xl border border-secondary/20 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama bahan atau satuan..."
              className="w-full pl-10 pr-10 py-2.5 bg-secondary/10 border border-secondary/25 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary"
              >
                <XCircle size={17} />
              </button>
            )}
          </div>
          <div className="text-sm text-primary/60">
            Menampilkan{' '}
            <span className="font-semibold text-primary">{filteredMaterials.length}</span>{' '}
            dari{' '}
            <span className="font-semibold text-primary">{materials.length}</span>{' '}
            bahan
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-primary/50">Memuat data bahan baku...</div>
        ) : materials.length === 0 ? (
          <div className="p-12 text-center text-primary/50">Belum ada data bahan baku.</div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-primary/40" />
            </div>
            <h3 className="font-semibold text-primary">Bahan baku tidak ditemukan</h3>
            <p className="text-sm text-primary/50 mt-1">
              Tidak ada bahan yang cocok dengan pencarian "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
                <tr>
                  <th className="px-6 py-3 w-16">No</th>
                  <th className="px-6 py-3">Nama Bahan</th>
                  <th className="px-6 py-3">Satuan</th>
                  <th className="px-6 py-3">Stok Saat Ini</th>
                  <th className="px-6 py-3">Minimum Stok</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {filteredMaterials.map((item, index) => {
                  const currentStock = Number(item.stock?.quantity || 0);
                  const minStock = Number(item.minimum_stock || 0);
                  const isEmpty = currentStock <= 0;
                  const isLow = currentStock > 0 && currentStock <= minStock;
                  const isSafe = currentStock > minStock;

                  return (
                    <tr key={item.id} className="hover:bg-quaternary/50 transition">
                      <td className="px-6 py-4 text-primary/70">{index + 1}</td>

                      <td className="px-6 py-4 font-medium text-primary">{item.name}</td>

                      <td className="px-6 py-4 text-primary/80">{item.unit}</td>

                      <td className="px-6 py-4 font-bold text-primary">
                        {currentStock} {item.unit}
                      </td>

                      <td className="px-6 py-4 text-primary/70">
                        {minStock} {item.unit}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.is_active === false ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Nonaktif
                          </span>
                        ) : isEmpty ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle size={12} />
                            Stok Habis
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <AlertTriangle size={12} />
                            Stok Rendah
                          </span>
                        ) : isSafe ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle size={12} />
                            Aman
                          </span>
                        ) : null}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={`/materials/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/15 text-primary hover:bg-secondary/25 rounded transition text-xs font-semibold"
                        >
                          <Layers size={14} />
                          Detail
                        </Link>
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary/20 text-primary hover:bg-tertiary/40 rounded transition text-xs font-semibold"
                        >
                          <Edit size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition text-xs font-semibold"
                        >
                          <Trash2 size={13} />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal tambah / edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative text-primary">
            <h2 className="text-lg font-bold mb-4">
              {editingItem ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Nama */}
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Nama Bahan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Contoh: Tepung Terigu, Gula Pasir"
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  autoFocus
                />
              </div>

              {/* Satuan */}
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  required
                  placeholder="Contoh: kg, gram, pcs, liter"
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                />
              </div>

              {/* Minimum stok */}
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Minimum Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={form.minimum_stock}
                  onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })}
                  required
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                />
              </div>

              {/* Status aktif */}
              {editingItem && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 text-tertiary rounded border-secondary/25 focus:ring-tertiary"
                  />
                  <label htmlFor="is_active" className="text-xs font-medium text-primary">
                    Bahan Aktif
                  </label>
                </div>
              )}

              {/* Tombol */}
              <div className="flex justify-end gap-2 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
