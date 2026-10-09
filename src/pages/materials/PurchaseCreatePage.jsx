import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { materialService, purchaseService } from '../../services/materialService';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function PurchaseCreatePage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  // Cache satuan per material: { [materialId]: [ { id, name, conversion_factor, is_base } ] }
  const [unitsByMaterial, setUnitsByMaterial] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    purchaseDate: new Date().toISOString().split('T')[0],
    supplier: '',
    paymentMethod: 'TRANSFER',
    notes: '',
    items: [{ materialId: '', unitId: '', quantity: '', unitPrice: '' }],
  });

  const fetchMaterials = async () => {
    try {
      const data = await materialService.getAll();
      setMaterials(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Gagal mengambil bahan baku:', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Fetch unit list untuk material jika belum ada di cache
  const ensureUnitsLoaded = async (materialId) => {
    if (!materialId || unitsByMaterial[materialId]) return;
    try {
      const units = await materialService.getUnits(materialId);
      const unitList = Array.isArray(units) ? units : units.data || [];
      setUnitsByMaterial((prev) => ({
        ...prev,
        [materialId]: unitList,
      }));
      return unitList;
    } catch (err) {
      console.error('Gagal mengambil satuan bahan:', err);
      return [];
    }
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { materialId: '', unitId: '', quantity: '', unitPrice: '' }],
    }));
  };

  const handleRemoveItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = async (index, field, value) => {
    if (field === 'materialId') {
      const matId = value;
      let defaultUnitId = '';

      if (matId) {
        // Cek apakah sudah ter-cache
        let uList = unitsByMaterial[matId];
        if (!uList) {
          uList = await ensureUnitsLoaded(matId);
        }
        // Cari satuan dasar (is_base === true)
        const baseUnit = uList?.find((u) => u.is_base);
        defaultUnitId = baseUnit ? String(baseUnit.id) : (uList?.[0] ? String(uList[0].id) : '');
      }

      setForm((prev) => {
        const updated = [...prev.items];
        updated[index] = {
          ...updated[index],
          materialId: matId,
          unitId: defaultUnitId, // Reset pilihan satuan ke satuan dasar
        };
        return { ...prev, items: updated };
      });
      return;
    }

    setForm((prev) => {
      const updated = [...prev.items];
      updated[index][field] = value;
      return { ...prev, items: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!form.purchaseDate) throw new Error('Tanggal pembelian wajib diisi');
      if (form.items.length === 0) throw new Error('Minimal harus ada 1 item');

      const validItems = form.items
        .filter((item) => item.materialId && Number(item.quantity) > 0 && Number(item.unitPrice) >= 0)
        .map((item) => ({
          materialId: parseInt(item.materialId),
          unitId: item.unitId ? parseInt(item.unitId) : undefined,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        }));

      if (validItems.length === 0) {
        throw new Error('Minimal harus ada 1 item yang valid (Quantity > 0 dan Harga >= 0)');
      }

      const payload = {
        purchaseDate: form.purchaseDate,
        supplierId: null,
        supplier: form.supplier.trim() || undefined,
        paymentMethod: form.paymentMethod,
        notes: form.notes.trim() || undefined,
        items: validItems,
      };

      await purchaseService.create(payload);
      setSuccess('Pembelian berhasil dicatat dan stok berhasil dikonversi');
      setTimeout(() => {
        navigate('/material-purchases');
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = (item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return Math.round(qty * price * 100) / 100;
  };

  const total = form.items.reduce((sum, item) => sum + subtotal(item), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <Link to="/material-purchases" className="text-sm text-tertiary hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-primary">Catat Pembelian Bahan Baku</h1>

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

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-secondary/20 p-6 shadow-sm space-y-6">
        {/* Header Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">
              Tanggal Pembelian <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              required
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-primary/70 mb-1">Supplier</label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              placeholder="Nama supplier (opsional)"
              className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
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
              <option value="TRANSFER">Transfer</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-primary/70 mb-1">Catatan</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Catatan pembelian (opsional)"
            rows={2}
            className="w-full bg-secondary/10 border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
          />
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-primary">Item Pembelian</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-tertiary text-primary rounded-lg text-xs font-semibold hover:bg-tertiary/90 transition shadow-sm"
            >
              <Plus size={14} />
              Tambah Item
            </button>
          </div>

          <div className="space-y-4">
            {form.items.map((item, index) => {
              const selectedMaterial = materials.find((m) => String(m.id) === String(item.materialId));
              const availableUnits = item.materialId ? (unitsByMaterial[item.materialId] || []) : [];
              const selectedUnit = availableUnits.find((u) => String(u.id) === String(item.unitId));

              // Label harga dinamis
              const priceLabel = selectedUnit ? `Harga per ${selectedUnit.name}` : 'Harga Satuan';

              // Hitung info pratinjau konversi
              const qty = Number(item.quantity) || 0;
              const unitPrice = Number(item.unitPrice) || 0;
              const factor = Number(selectedUnit?.conversion_factor || 1);
              const baseQty = qty * factor;
              const baseUnitName = selectedMaterial?.unit || '';
              const isBaseUnit = selectedUnit?.is_base || (selectedUnit && factor === 1 && selectedUnit.name === baseUnitName);
              const pricePerBaseUnit = baseQty > 0 ? (subtotal(item) / baseQty) : 0;

              return (
                <div
                  key={index}
                  className="border border-secondary/20 rounded-lg p-4 bg-quaternary/30 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* 1. Bahan */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-primary/70 mb-1">Bahan</label>
                      <select
                        value={item.materialId}
                        onChange={(e) => handleItemChange(index, 'materialId', e.target.value)}
                        required
                        className="w-full bg-white border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                      >
                        <option value="">Pilih bahan baku</option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} (dasar: {m.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Satuan (BARU) */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-primary/70 mb-1">
                        Satuan Beli <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={item.unitId}
                        onChange={(e) => handleItemChange(index, 'unitId', e.target.value)}
                        required
                        disabled={!item.materialId}
                        className="w-full bg-white border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {availableUnits.length === 0 ? (
                          <option value="">{item.materialId ? 'Memuat satuan...' : 'Pilih bahan dulu'}</option>
                        ) : (
                          availableUnits.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} {u.is_base ? '(Satuan Dasar)' : `(= ${Number(u.conversion_factor)} ${selectedMaterial?.unit})`}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* 3. Qty */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-primary/70 mb-1">Qty</label>
                      <input
                        type="number"
                        step="any"
                        min="0.0001"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        placeholder="0"
                        className="w-full bg-white border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                      />
                    </div>

                    {/* 4. Harga per [satuan] */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-primary/70 mb-1 truncate" title={priceLabel}>
                        {priceLabel}
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        required
                        placeholder="Rp"
                        className="w-full bg-white border border-secondary/25 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                      />
                    </div>

                    {/* 5. Subtotal */}
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-primary/70 mb-1">Subtotal</label>
                      <div className="py-2 px-2 bg-secondary/10 rounded-lg text-xs font-semibold text-primary truncate" title={formatPrice(subtotal(item))}>
                        {formatPrice(subtotal(item))}
                      </div>
                    </div>

                    {/* 6. Hapus */}
                    <div className="md:col-span-1">
                      {form.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="w-full flex items-center justify-center py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Hapus item"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pratinjau Konversi Stok (Hanya informasi, bukan yang dikirim ke server) */}
                  {selectedMaterial && selectedUnit && !isBaseUnit && qty > 0 && (
                    <div className="pt-2 border-t border-secondary/15 flex flex-wrap items-center gap-3 text-xs text-blue-800 bg-blue-50/70 p-2.5 rounded-md">
                      <span className="font-semibold">📦 Pratinjau Konversi:</span>
                      <span>
                        Masuk stok: <strong>+{baseQty.toLocaleString('id-ID', { maximumFractionDigits: 4 })} {baseUnitName}</strong>
                      </span>
                      {unitPrice > 0 && (
                        <span className="text-primary/70">
                          (≈ {formatPrice(pricePerBaseUnit)} / {baseUnitName})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end pt-4 border-t border-secondary/15">
          <div className="text-right">
            <p className="text-sm text-primary/60">Total Pembelian</p>
            <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-secondary/15">
          <Link
            to="/material-purchases"
            className="px-5 py-2.5 rounded-lg border border-secondary/25 text-sm font-medium hover:bg-secondary/10 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-tertiary text-primary text-sm font-semibold hover:bg-tertiary/90 transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Pembelian'}
          </button>
        </div>
      </form>
    </div>
  );
}
