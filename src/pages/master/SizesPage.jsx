import React, { useState, useEffect } from 'react';
import { sizesService } from '../../services/masterDataService';

export default function SizesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [name, setName] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sizesService.getAll();
      setItems(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingItem) {
        await sizesService.update(editingItem.id, { name });
        setSuccess('Size berhasil diperbarui');
      } else {
        await sizesService.create({ name });
        setSuccess('Size berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus size ini?')) return;
    setError('');
    setSuccess('');
    try {
      await sizesService.delete(id);
      setSuccess('Size berhasil dihapus');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Master Data: Sizes (Ukuran)</h1>
          <p className="text-primary/60 text-sm">Kelola ukuran kue (18cm, 20cm, Regular, Large)</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-tertiary text-primary rounded-lg font-semibold hover:bg-tertiary/90 transition shadow-sm text-sm"
        >
          + Tambah Size
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-100 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-primary/50">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-primary/50">Belum ada data size.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
                <tr>
                  <th className="px-6 py-3 w-20">ID</th>
                  <th className="px-6 py-3">Nama Size</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-quaternary/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-primary/70">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-primary">{item.name}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1 bg-tertiary/20 text-primary hover:bg-tertiary/40 rounded transition text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition text-xs font-semibold"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative text-primary">
            <h2 className="text-lg font-bold mb-4">
              {editingItem ? 'Edit Size' : 'Tambah Size Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary/70 mb-1">
                  Nama Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: 18cm, 20cm, Medium"
                  className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
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
