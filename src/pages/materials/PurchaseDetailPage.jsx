import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { purchaseService } from '../../services/materialService';
import { ArrowLeft } from 'lucide-react';

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

export default function PurchaseDetailPage() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await purchaseService.getById(id);
        setPurchase(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-primary/50">Memuat detail pembelian...</div>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/material-purchases" className="text-sm text-tertiary hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!purchase) return null;

  const items = purchase.material_purchase_items || purchase.items || [];
  const total = Number(purchase.total_amount || 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          to="/material-purchases"
          className="text-sm text-tertiary hover:underline inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-primary">Detail Pembelian Bahan Baku</h1>
        <p className="text-primary/60 text-sm mt-1">Nomor: {purchase.purchase_number || purchase.id}</p>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-xl border border-secondary/20 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-primary/60 text-xs">Tanggal Pembelian</p>
            <p className="font-semibold text-primary mt-1">{formatDate(purchase.purchase_date)}</p>
          </div>
          <div>
            <p className="text-primary/60 text-xs">Supplier</p>
            <p className="font-semibold text-primary mt-1">{purchase.supplier || '-'}</p>
          </div>
          <div>
            <p className="text-primary/60 text-xs">Metode Pembayaran</p>
            <p className="mt-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/15 text-primary">
                {purchase.payment_method}
              </span>
            </p>
          </div>
          <div>
            <p className="text-primary/60 text-xs">Total Pembelian</p>
            <p className="font-bold text-primary mt-1 text-lg">{formatPrice(total)}</p>
          </div>
          {purchase.notes && (
            <div className="md:col-span-2">
              <p className="text-primary/60 text-xs">Catatan</p>
              <p className="text-primary mt-1">{purchase.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-secondary/20">
          <h2 className="text-lg font-bold text-primary">Item Pembelian</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
              <tr>
                <th className="px-6 py-3 w-16">No</th>
                <th className="px-6 py-3">Bahan</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Harga Satuan</th>
                <th className="px-6 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {items.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-quaternary/50 transition">
                  <td className="px-6 py-4 text-primary/70">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-primary">
                    {item.material?.name || `Material #${item.material_id}`}
                  </td>
                  <td className="px-6 py-4 text-center text-primary/80">
                    {Number(item.quantity)} {item.material?.unit || ''}
                  </td>
                  <td className="px-6 py-4 text-right text-primary/80">
                    {formatPrice(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-primary">
                    {formatPrice(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-secondary/30 bg-quaternary/50">
                <td colSpan="4" className="px-6 py-4 text-right font-bold text-primary">
                  Total
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary text-lg">
                  {formatPrice(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Expense Effect (if linked) */}
      {purchase.expense && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-amber-800 mb-2">Pengaruh ke Keuangan</h3>
          <div className="text-sm text-amber-700">
            <p>
              Pembelian ini secara otomatis mencatat pengeluaran:{' '}
              <strong className="font-bold">{formatPrice(purchase.expense.amount)}</strong>{' '}
              {purchase.expense.expense_number && (
                <span className="text-xs">
                  (No. Expense: {purchase.expense.expense_number})
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
