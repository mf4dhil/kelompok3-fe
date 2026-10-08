import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { purchaseService } from '../../services/materialService';
import { Plus, Eye, ArrowLeft } from 'lucide-react';

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

export default function PurchaseListPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPurchases = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await purchaseService.getAll();
      setPurchases(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pembelian Bahan Baku</h1>
          <p className="text-primary/60 text-sm">Histori pembelian bahan baku dan stok masuk</p>
        </div>
        <Link
          to="/material-purchases/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary text-primary rounded-lg font-semibold hover:bg-tertiary/90 transition shadow-sm text-sm"
        >
          <Plus size={16} />
          Catat Pembelian
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-primary/50">Memuat data pembelian...</div>
        ) : purchases.length === 0 ? (
          <div className="p-12 text-center text-primary/50">
            Belum ada data pembelian bahan baku.
            <div className="mt-3">
              <Link
                to="/material-purchases/create"
                className="text-tertiary font-semibold text-sm hover:underline"
              >
                Catat pembelian pertama →
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
                <tr>
                  <th className="px-6 py-3">No. Pembelian</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Metode</th>
                  <th className="px-6 py-3 text-right">Total</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {purchases.map((item) => (
                  <tr key={item.id} className="hover:bg-quaternary/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-primary/70">
                      {item.purchase_number || item.id}
                    </td>
                    <td className="px-6 py-4 text-primary/80">{formatDate(item.purchase_date || item.createdAt)}</td>
                    <td className="px-6 py-4 text-primary/80">{item.supplier || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/15 text-primary capitalize">
                        {item.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      {formatPrice(item.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/material-purchases/${item.id}`}
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
