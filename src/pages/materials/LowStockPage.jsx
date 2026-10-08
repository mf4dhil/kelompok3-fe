import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materialService } from '../../services/materialService';
import { AlertTriangle, CheckCircle, Layers, ArrowLeft } from 'lucide-react';

export default function LowStockPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLowStock = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await materialService.getLowStock();
      setItems(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/materials" className="text-sm text-tertiary hover:underline flex items-center gap-1">
              <ArrowLeft size={16} /> Kembali ke Bahan Baku
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-primary">Bahan Baku Stok Rendah</h1>
          <p className="text-primary/60 text-sm">Daftar bahan baku yang berada di bawah atau sama dengan minimum stok</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-primary/50">Memuat data stok rendah...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-green-700 bg-green-50/50 flex flex-col items-center justify-center gap-2">
            <CheckCircle size={32} className="text-green-600" />
            <p className="font-semibold text-lg">Semua stok bahan baku aman!</p>
            <p className="text-sm text-primary/60">Tidak ada bahan baku yang berada di bawah minimum stok.</p>
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
                  <th className="px-6 py-3">Kekurangan</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {items.map((item, index) => {
                  const currentStock = Number(item.stock?.quantity || 0);
                  const minStock = Number(item.minimum_stock || 0);
                  const deficit = minStock - currentStock;

                  return (
                    <tr key={item.id} className="hover:bg-quaternary/50 transition">
                      <td className="px-6 py-4 text-primary/70">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-primary">{item.name}</td>
                      <td className="px-6 py-4 text-primary/80">{item.unit}</td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        {currentStock} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-primary/70">
                        {minStock} {item.unit}
                      </td>
                      <td className="px-6 py-4 font-semibold text-amber-700">
                        Kurang {deficit > 0 ? deficit : 0} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/materials/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary text-primary hover:bg-tertiary/90 rounded transition text-xs font-semibold shadow-sm"
                        >
                          <Layers size={14} />
                          Detail / Restock
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
