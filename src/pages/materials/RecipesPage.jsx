import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, ChefHat } from "lucide-react";
import { recipeService } from "../../services/recipeService";
import { materialService } from "../../services/materialService";

const variantLabel = (variant) => {
  const parts = [variant.product?.name, variant.size?.name, variant.shape?.name, variant.flavor?.name]
    .filter(Boolean);
  return `${parts.join(" · ")} (Varian #${variant.id})`;
};

export default function RecipesPage() {
  const [variants, setVariants] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [recipeResponse, materialResponse] = await Promise.all([
        recipeService.getAll(),
        materialService.getAll(),
      ]);
      const nextVariants = recipeResponse.data || recipeResponse;
      const nextMaterials = materialResponse.data || materialResponse;
      setVariants(Array.isArray(nextVariants) ? nextVariants : []);
      setMaterials((Array.isArray(nextMaterials) ? nextMaterials : []).filter((material) => material.is_active !== false));
    } catch (err) {
      setError(err.message || "Gagal memuat data resep");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const selectedVariant = useMemo(
    () => variants.find((variant) => String(variant.id) === String(selectedId)),
    [variants, selectedId],
  );

  const selectVariant = (id) => {
    setSelectedId(id);
    const variant = variants.find((item) => String(item.id) === String(id));
    setItems((variant?.recipe_items || []).map((item) => ({
      material_id: String(item.material_id),
      quantity: String(item.quantity),
    })));
    setError("");
    setSuccess("");
  };

  const updateItem = (index, key, value) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  const save = async (event) => {
    event.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const recipeItems = items.map((item) => ({
        material_id: Number(item.material_id),
        quantity: Number(item.quantity),
      }));
      await recipeService.updateVariant(selectedId, recipeItems);
      setSuccess("Resep berhasil disimpan. Pesanan baru akan memakai stok sesuai takaran ini.");
      await loadData();
      const updated = variants.find((variant) => String(variant.id) === String(selectedId));
      if (updated) setItems(recipeItems.map((item) => ({ material_id: String(item.material_id), quantity: String(item.quantity) })));
    } catch (err) {
      setError(err.message || "Gagal menyimpan resep");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-primary">Resep & Pemakaian Bahan</h1>
        <p className="mt-1 text-sm text-primary/60">Atur kebutuhan bahan untuk satu varian kue. Stok berkurang otomatis saat pesanan dibuat.</p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      {loading ? <div className="rounded-xl bg-white p-8 text-center text-primary/60">Memuat daftar resep...</div> : (
        <form onSubmit={save} className="max-w-4xl space-y-5 rounded-xl border border-primary/10 bg-white p-5 shadow-sm sm:p-6">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-primary">Varian kue</span>
            <select value={selectedId} onChange={(event) => selectVariant(event.target.value)} required className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2.5 text-sm">
              <option value="">Pilih produk dan varian</option>
              {variants.map((variant) => <option key={variant.id} value={variant.id}>{variantLabel(variant)}</option>)}
            </select>
          </label>

          {selectedVariant && (
            <section className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-quaternary/40 p-3 text-sm text-primary/75">
                <ChefHat size={19} className="mt-0.5 shrink-0" />
                <p>Takaran dihitung untuk <strong>1 kue</strong> dan menggunakan satuan dasar bahan (misalnya gram, ml, atau pcs sesuai satuan stok).</p>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => {
                  const material = materials.find((entry) => String(entry.id) === String(item.material_id));
                  return (
                    <div key={`${index}-${item.material_id}`} className="grid gap-3 rounded-lg border border-primary/10 p-3 sm:grid-cols-[minmax(0,1fr)_160px_42px] sm:items-end">
                      <label className="space-y-1.5">
                        <span className="text-xs font-medium text-primary/70">Bahan baku</span>
                        <select value={item.material_id} onChange={(event) => updateItem(index, "material_id", event.target.value)} required className="w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm">
                          <option value="">Pilih bahan</option>
                          {materials.map((entry) => <option key={entry.id} value={entry.id}>{entry.name} ({entry.unit})</option>)}
                        </select>
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-xs font-medium text-primary/70">Takaran per kue</span>
                        <div className="flex items-center gap-2">
                          <input type="number" min="0.001" step="0.001" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} required className="min-w-0 flex-1 rounded-md border border-primary/20 px-3 py-2 text-sm" />
                          <span className="w-10 text-xs text-primary/60">{material?.unit || "unit"}</span>
                        </div>
                      </label>
                      <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Hapus bahan dari resep" className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button type="button" onClick={() => setItems((current) => [...current, { material_id: "", quantity: "" }])} className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"><Plus size={17} />Tambah bahan</button>
                <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save size={17} />{saving ? "Menyimpan..." : "Simpan resep"}</button>
              </div>
            </section>
          )}
          {!selectedVariant && <p className="rounded-lg bg-primary/5 p-4 text-sm text-primary/60">Pilih varian untuk mengatur resepnya.</p>}
        </form>
      )}
    </main>
  );
}
