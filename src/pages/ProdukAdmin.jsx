import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Plus, Eye, EyeOff, MoreVertical, ChevronRight, ChevronLeft } from 'lucide-react';

import { getProducts, createProduct, updateProduct, deleteProduct, updateProductStatus } from '../services/productService';
import { getShapes, getSizes, getFlavors, getTypes } from '../services/masterService';

// Step constants
const STEPS = {
  INFO: 1,
  SHAPE: 2,
  SIZE: 3,
  FLAVOR: 4,
  VARIANTS: 5,
};

const STEP_LABELS = {
  [STEPS.INFO]: 'Informasi Produk',
  [STEPS.SHAPE]: 'Pilih Bentuk',
  [STEPS.SIZE]: 'Pilih Ukuran',
  [STEPS.FLAVOR]: 'Pilih Rasa',
  [STEPS.VARIANTS]: 'Atur Variant & Harga',
};

export default function ProdukAdmin() {
  const navigate = useNavigate();
  
  // Products list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState(null);

  // Form modal
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(STEPS.INFO);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type_id: '',
    is_active: true,
  });
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [generatedVariants, setGeneratedVariants] = useState([]);

  // Master data
  const [shapes, setShapes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [types, setTypes] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response);
    } catch (error) {
      console.error('Gagal mengambil data produk:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch master data (shapes, sizes, flavors, types)
  const fetchMasterData = async () => {
    try {
      const [shapesData, sizesData, flavorsData, typesData] = await Promise.all([
        getShapes(),
        getSizes(),
        getFlavors(),
        getTypes(),
      ]);
      setShapes(shapesData);
      setSizes(sizesData);
      setFlavors(flavorsData);
      setTypes(typesData);
    } catch (error) {
      console.error('Gagal mengambil data master:', error);
    }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { if (formVisible) fetchMasterData(); }, [formVisible]);

  // Reset form to initial state
  const resetForm = () => {
    setCurrentStep(STEPS.INFO);
    setFormData({ name: '', description: '', type_id: '', is_active: true });
    setSelectedShapes([]);
    setSelectedSizes([]);
    setSelectedFlavors([]);
    setGeneratedVariants([]);
    setEditing(false);
    setCurrentProductId(null);
  };

  // Open form for new product
  const handleAddNew = () => {
    resetForm();
    setFormVisible(true);
  };

  // Open form for editing existing product
  const handleEdit = async (product) => {
    try {
      await fetchMasterData();
      setEditing(true);
      setCurrentProductId(product.id);
      setFormData({
        name: product.name,
        description: product.description || '',
        type_id: product.type_id || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
      });

      // Extract selected shapes/sizes/flavors from existing variants
      if (product.productvariants && product.productvariants.length > 0) {
        const shapeIds = [...new Set(product.productvariants.map(v => v.shape_id).filter(Boolean))];
        const sizeIds = [...new Set(product.productvariants.map(v => v.size_id).filter(Boolean))];
        const flavorIds = [...new Set(product.productvariants.map(v => v.flavor_id).filter(Boolean))];

        setSelectedShapes(shapeIds);
        setSelectedSizes(sizeIds);
        setSelectedFlavors(flavorIds);

        // Map existing variants to generated format
        const variants = product.productvariants.map(v => ({
          shape_id: v.shape_id,
          size_id: v.size_id,
          flavor_id: v.flavor_id,
          price: parseInt(v.price) || 0,
          is_active: v.is_active !== undefined ? v.is_active : true,
        }));
        setGeneratedVariants(variants);
      }

      setFormVisible(true);
      setCurrentStep(STEPS.VARIANTS); // Jump directly to variants step when editing
    } catch (error) {
      console.error('Gagal memuat data produk:', error);
    }
  };

  // Generate all combinations from selected shapes/sizes/flavors
  const generateCombinations = () => {
    if (selectedShapes.length === 0 || selectedSizes.length === 0 || selectedFlavors.length === 0) {
      alert('Pilih minimal satu bentuk, ukuran, dan rasa');
      return;
    }

    const combos = [];
    for (const shapeId of selectedShapes) {
      for (const sizeId of selectedSizes) {
        for (const flavorId of selectedFlavors) {
          // Check if this combo already exists in generatedVariants
          const existing = generatedVariants.find(
            v => v.shape_id === shapeId && v.size_id === sizeId && v.flavor_id === flavorId
          );
          if (!existing) {
            combos.push({
              shape_id: shapeId,
              size_id: sizeId,
              flavor_id: flavorId,
              price: 0,
              is_active: true,
            });
          }
        }
      }
    }

    setGeneratedVariants(prev => [...prev, ...combos]);
    setCurrentStep(STEPS.VARIANTS);
  };

  // Toggle a variant's active status
  const toggleVariantActive = (index) => {
    setGeneratedVariants(prev =>
      prev.map((v, i) => i === index ? { ...v, is_active: !v.is_active } : v)
    );
  };

  // Update variant price
  const updateVariantPrice = (index, price) => {
    setGeneratedVariants(prev =>
      prev.map((v, i) => i === index ? { ...v, price: parseInt(price) || 0 } : v)
    );
  };

  // Remove a variant from the list
  const removeVariant = (index) => {
    setGeneratedVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Save product (create or update)
  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      alert('Nama produk wajib diisi');
      setCurrentStep(STEPS.INFO);
      return;
    }
    if (!formData.type_id) {
      alert('Tipe produk wajib dipilih');
      setCurrentStep(STEPS.INFO);
      return;
    }

    const activeVariants = generatedVariants.filter(v => v.is_active);
    if (activeVariants.length === 0) {
      alert('Minimal satu variant harus aktif');
      return;
    }

    for (const v of activeVariants) {
      if (!v.price || v.price <= 0) {
        alert('Setiap variant aktif harus memiliki harga yang valid');
        return;
      }
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        type_id: parseInt(formData.type_id),
        is_active: formData.is_active,
        variants: activeVariants,
      };

      if (editing && currentProductId) {
        await updateProduct(currentProductId, payload);
      } else {
        await createProduct(payload);
      }

      setFormVisible(false);
      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error('Gagal menyimpan produk:', error);
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error('Gagal menghapus produk:', error);
      alert('Gagal menghapus: ' + (error.response?.data?.message || error.message));
    }
  };

  // Toggle product status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateProductStatus(id, currentStatus ? 'tidak_aktif' : 'aktif');
      await fetchProducts();
    } catch (error) {
      console.error('Gagal mengubah status:', error);
      alert('Gagal mengubah status: ' + (error.response?.data?.message || error.message));
    }
  };

  // Helper: find name by id
  const getShapeName = (id) => shapes.find(s => s.id === id)?.name || '-';
  const getSizeName = (id) => sizes.find(s => s.id === id)?.name || '-';
  const getFlavorName = (id) => flavors.find(f => f.id === id)?.name || '-';
  const getTypeName = (id) => types.find(t => t.id === id)?.name || '-';

  // Format currency
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(price || 0);

  // Get min price from variants for table display
  const getProductMinPrice = (product) => {
    if (!product.productvariants || product.productvariants.length === 0) return 0;
    const prices = product.productvariants
      .filter(v => v.is_active !== false)
      .map(v => parseInt(v.price))
      .filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getProductVariantCount = (product) => {
    if (!product.productvariants) return 0;
    return product.productvariants.filter(v => v.is_active !== false).length;
  };

  // Step navigation
  const canGoNext = () => {
    switch (currentStep) {
      case STEPS.INFO: return formData.name.trim() && formData.type_id;
      case STEPS.SHAPE: return selectedShapes.length > 0;
      case STEPS.SIZE: return selectedSizes.length > 0;
      case STEPS.FLAVOR: return selectedFlavors.length > 0;
      default: return true;
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.VARIANTS) {
      if (currentStep === STEPS.FLAVOR) {
        generateCombinations();
      } else {
        setCurrentStep(s => s + 1);
      }
    }
  };

  const goPrev = () => {
    if (currentStep > STEPS.INFO) {
      setCurrentStep(s => s - 1);
    }
  };

  // Toggle selection helpers
  const toggleShape = (id) => {
    setSelectedShapes(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSize = (id) => {
    setSelectedSizes(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleFlavor = (id) => {
    setSelectedFlavors(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Header */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-primary'>Manajemen Produk</h2>
          <p className='text-primary/60'>Kelola produk kue dan varian harganya</p>
        </div>
        <button
          onClick={handleAddNew}
          className='inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-tertiary hover:bg-tertiary/90 text-primary transition shadow-sm hover:shadow-tertiary/20'
        >
          <Plus className='w-4 h-4 mr-2' /> Tambah Produk
        </button>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
        <div className='bg-white rounded-xl border border-secondary/20 p-4 shadow-sm'>
          <p className='text-xs text-primary/60'>Total Produk</p>
          <p className='text-xl font-bold text-primary'>{products.length}</p>
        </div>
        <div className='bg-white rounded-xl border border-secondary/20 p-4 shadow-sm'>
          <p className='text-xs text-primary/60'>Produk Aktif</p>
          <p className='text-xl font-bold text-green-600'>{products.filter(p => p.is_active !== false).length}</p>
        </div>
        <div className='bg-white rounded-xl border border-secondary/20 p-4 shadow-sm'>
          <p className='text-xs text-primary/60'>Total Variants</p>
          <p className='text-xl font-bold text-primary'>{products.reduce((sum, p) => sum + getProductVariantCount(p), 0)}</p>
        </div>
        <div className='bg-white rounded-xl border border-secondary/20 p-4 shadow-sm'>
          <p className='text-xs text-primary/60'>Non-Aktif</p>
          <p className='text-xl font-bold text-red-400'>{products.filter(p => p.is_active === false).length}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm'>
        <div className='p-5 border-b border-secondary/10'>
          <h3 className='text-lg font-bold text-primary'>Daftar Produk</h3>
        </div>

        {loading ? (
          <div className='p-8 text-center text-primary/50'>Memuat data...</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-quaternary'>
                <tr>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-primary'>No</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-primary'>Nama Produk</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-primary'>Tipe</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-primary'>Harga Mulai</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-primary'>Variants</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-primary'>Status</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-primary'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} className='px-5 py-8 text-center text-primary/50'>Belum ada produk</td></tr>
                ) : products.map((product, index) => (
                  <tr key={product.id} className='border-t border-secondary/10 hover:bg-quaternary/70'>
                    <td className='px-5 py-3 text-sm text-primary'>{index + 1}</td>
                    <td className='px-5 py-3 text-sm font-medium text-primary'>{product.name}</td>
                    <td className='px-5 py-3 text-sm text-primary/70'>{getTypeName(product.type_id)}</td>
                    <td className='px-5 py-3 text-sm text-primary/70'>{formatPrice(getProductMinPrice(product))}</td>
                    <td className='px-5 py-3 text-sm text-primary/70'>{getProductVariantCount(product)} varian</td>
                    <td className='px-5 py-3'>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.is_active !== false ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className='px-5 py-3'>
                      <div className='flex gap-1'>
                        <button onClick={() => handleToggleStatus(product.id, product.is_active)} className='p-1.5 rounded hover:bg-secondary/30 text-primary/70 hover:text-primary transition' title={product.is_active !== false ? 'Nonaktifkan' : 'Aktifkan'}>
                          {product.is_active !== false ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
                        </button>
                        <button onClick={() => handleEdit(product)} className='p-1.5 rounded hover:bg-secondary/30 text-primary/70 hover:text-primary transition' title='Edit'>
                          <Edit className='w-3.5 h-3.5' />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className='p-1.5 rounded hover:bg-red-100 text-red-400 hover:text-red-600 transition' title='Hapus'>
                          <Delete className='w-3.5 h-3.5' />
                        </button>
                        <button onClick={() => setDetailProduct(product)} className='p-1.5 rounded hover:bg-secondary/30 text-primary/70 hover:text-primary transition' title='Detail'>
                          <MoreVertical className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== MULTI-STEP FORM MODAL ==================== */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 ${formVisible ? '' : 'hidden'}`} onClick={(e) => e.target === e.currentTarget && setFormVisible(false)}>
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
          
          {/* Modal Header */}
          <div className='sticky top-0 bg-white z-10 px-6 pt-6 pb-3 border-b border-secondary/10'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-xl font-bold text-primary'>{editing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={() => { setFormVisible(false); resetForm(); }} className='text-primary/40 hover:text-primary text-sm font-bold'>✕</button>
            </div>

            {/* Step Indicator */}
            <div className='flex items-center gap-1'>
              {Object.entries(STEP_LABELS).map(([step, label]) => {
                const stepNum = parseInt(step);
                const isActive = stepNum === currentStep;
                const isDone = stepNum < currentStep;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${isActive ? 'bg-tertiary text-primary' : isDone ? 'bg-green-100 text-green-700' : 'bg-secondary/20 text-primary/40'}`}>
                      {isDone ? '✓' : stepNum}
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                    {stepNum < Object.keys(STEPS).length && <div className={`w-4 h-px ${stepNum < currentStep ? 'bg-green-400' : 'bg-secondary/20'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Modal Body - Step Content */}
          <div className='px-6 py-5'>
            
            {/* ===== STEP 1: Informasi Produk ===== */}
            {currentStep === STEPS.INFO && (
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-primary mb-1.5'>Nama Produk <span className='text-red-500'>*</span></label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder='Contoh: Bolu Gulung'
                    className='w-full bg-secondary/10 border border-secondary/25 rounded-lg px-4 py-2.5 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent'
                    autoFocus
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-primary mb-1.5'>Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Deskripsi singkat produk...'
                    rows={3}
                    className='w-full bg-secondary/10 border border-secondary/25 rounded-lg px-4 py-2.5 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent resize-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-primary mb-1.5'>Tipe Produk <span className='text-red-500'>*</span></label>
                  <select
                    value={formData.type_id}
                    onChange={e => setFormData({ ...formData, type_id: e.target.value })}
                    className='w-full bg-secondary/10 border border-secondary/25 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent'
                  >
                    <option value=''>-- Pilih Tipe --</option>
                    {types.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-primary mb-1.5'>Status</label>
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, is_active: true })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.is_active ? 'bg-green-500 text-white' : 'bg-secondary/10 text-primary/70 hover:bg-secondary/20'}`}
                    >
                      Aktif
                    </button>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, is_active: false })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!formData.is_active ? 'bg-red-500 text-white' : 'bg-secondary/10 text-primary/70 hover:bg-secondary/20'}`}
                    >
                      Non-Aktif
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== STEP 2: Pilih Shape ===== */}
            {currentStep === STEPS.SHAPE && (
              <div>
                <p className='text-sm text-primary/60 mb-3'>Pilih bentuk yang tersedia untuk produk ini:</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {shapes.map(shape => (
                    <button
                      key={shape.id}
                      type='button'
                      onClick={() => toggleShape(shape.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                        selectedShapes.includes(shape.id)
                          ? 'border-tertiary bg-tertiary text-primary shadow-sm'
                          : 'border-secondary/20 bg-white text-primary/70 hover:border-tertiary/50 hover:bg-secondary/5'
                      }`}
                    >
                      {shape.name}
                    </button>
                  ))}
                </div>
                {selectedShapes.length === 0 && (
                  <p className='text-xs text-amber-600 mt-2'>⚠ Pilih minimal satu bentuk</p>
                )}
              </div>
            )}

            {/* ===== STEP 3: Pilih Size ===== */}
            {currentStep === STEPS.SIZE && (
              <div>
                <p className='text-sm text-primary/60 mb-3'>Pilih ukuran yang tersedia untuk produk ini:</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {sizes.map(size => (
                    <button
                      key={size.id}
                      type='button'
                      onClick={() => toggleSize(size.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                        selectedSizes.includes(size.id)
                          ? 'border-tertiary bg-tertiary text-primary shadow-sm'
                          : 'border-secondary/20 bg-white text-primary/70 hover:border-tertiary/50 hover:bg-secondary/5'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                {selectedSizes.length === 0 && (
                  <p className='text-xs text-amber-600 mt-2'>⚠ Pilih minimal satu ukuran</p>
                )}
              </div>
            )}

            {/* ===== STEP 4: Pilih Flavor ===== */}
            {currentStep === STEPS.FLAVOR && (
              <div>
                <p className='text-sm text-primary/60 mb-3'>Pilih rasa yang tersedia untuk produk ini:</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {flavors.map(flavor => (
                    <button
                      key={flavor.id}
                      type='button'
                      onClick={() => toggleFlavor(flavor.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                        selectedFlavors.includes(flavor.id)
                          ? 'border-tertiary bg-tertiary text-primary shadow-sm'
                          : 'border-secondary/20 bg-white text-primary/70 hover:border-tertiary/50 hover:bg-secondary/5'
                      }`}
                    >
                      {flavor.name}
                    </button>
                  ))}
                </div>
                {selectedFlavors.length === 0 && (
                  <p className='text-xs text-amber-600 mt-2'>⚠ Pilih minimal satu rasa</p>
                )}
                <div className='mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700'>
                  💡 Klik "Selanjutnya" untuk membuat kombinasi otomatis dari bentuk, ukuran, dan rasa yang dipilih.
                </div>
              </div>
            )}

            {/* ===== STEP 5: Atur Variants & Harga ===== */}
            {currentStep === STEPS.VARIANTS && (
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <p className='text-sm text-primary/60'>
                    Kombinasi variant ({generatedVariants.length}) — atur harga dan aktif/non-aktifkan:
                  </p>
                  {(selectedShapes.length > 0 || selectedSizes.length > 0 || selectedFlavors.length > 0) && !editing && (
                    <button
                      type='button'
                      onClick={generateCombinations}
                      className='text-xs px-3 py-1.5 rounded-lg bg-tertiary/20 text-tertiary hover:bg-tertiary/30 font-medium transition'
                    >
                      + Regenerate
                    </button>
                  )}
                </div>

                {generatedVariants.length === 0 ? (
                  <div className='text-center py-8 text-primary/40'>
                    <p>Belum ada kombinasi variant.</p>
                    <p className='text-xs mt-1'>Kembali ke langkah sebelumnya untuk memilih bentuk, ukuran, dan rasa.</p>
                    <button
                      type='button'
                      onClick={() => setCurrentStep(STEPS.FLAVOR)}
                      className='mt-3 text-sm text-tertiary underline'
                    >
                      ← Kembali ke Pilihan Rasa
                    </button>
                  </div>
                ) : (
                  <div className='overflow-x-auto border border-secondary/15 rounded-lg'>
                    <table className='w-full text-sm'>
                      <thead className='bg-quaternary'>
                        <tr>
                          <th className='text-left px-3 py-2 text-xs font-semibold text-primary w-16'>Aktif</th>
                          <th className='text-left px-3 py-2 text-xs font-semibold text-primary'>Bentuk</th>
                          <th className='text-left px-3 py-2 text-xs font-semibold text-primary'>Ukuran</th>
                          <th className='text-left px-3 py-2 text-xs font-semibold text-primary'>Rasa</th>
                          <th className='text-left px-3 py-2 text-xs font-semibold text-primary'>Harga (Rp)</th>
                          <th className='text-left px-3 py-2 text-xs font-semibold text-primary w-10'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedVariants.map((variant, idx) => (
                          <tr key={`${variant.shape_id}-${variant.size_id}-${variant.flavor_id}-${idx}`} className='border-t border-secondary/10'>
                            <td className='px-3 py-2'>
                              <input
                                type='checkbox'
                                checked={variant.is_active}
                                onChange={() => toggleVariantActive(idx)}
                                className='w-4 h-4 rounded border-secondary/30 text-tertiary focus:ring-tertiary cursor-pointer'
                              />
                            </td>
                            <td className='px-3 py-2 text-primary/80'>{getShapeName(variant.shape_id)}</td>
                            <td className='px-3 py-2 text-primary/80'>{getSizeName(variant.size_id)}</td>
                            <td className='px-3 py-2 text-primary/80'>{getFlavorName(variant.flavor_id)}</td>
                            <td className='px-3 py-2'>
                              <input
                                type='number'
                                value={variant.price || ''}
                                onChange={e => updateVariantPrice(idx, e.target.value)}
                                placeholder='0'
                                className='w-28 bg-secondary/10 border border-secondary/25 rounded px-2 py-1.5 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-tertiary'
                              />
                            </td>
                            <td className='px-3 py-2'>
                              <button
                                type='button'
                                onClick={() => removeVariant(idx)}
                                className='text-red-400 hover:text-red-600 text-xs'
                                title='Hapus variant'
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {generatedVariants.some(v => v.is_active && (!v.price || v.price <= 0)) && (
                  <p className='text-xs text-amber-600 mt-2'>⚠ Isi harga untuk semua variant yang aktif</p>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer - Navigation Buttons */}
          <div className='sticky bottom-0 bg-white z-10 px-6 py-4 border-t border-secondary/10 flex justify-between'>
            <div>
              {currentStep > STEPS.INFO && (
                <button
                  type='button'
                  onClick={goPrev}
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-primary/70 hover:text-primary border border-secondary/25 rounded-lg hover:bg-secondary/10 transition'
                >
                  <ChevronLeft className='w-4 h-4 mr-1' /> Sebelumnya
                </button>
              )}
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => { setFormVisible(false); resetForm(); }}
                className='px-4 py-2 text-sm font-medium text-primary/60 hover:text-primary border border-secondary/25 rounded-lg hover:bg-secondary/10 transition'
              >
                Batal
              </button>
              {currentStep < STEPS.VARIANTS ? (
                <button
                  type='button'
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition ${
                    canGoNext()
                      ? 'bg-tertiary text-primary hover:bg-tertiary/90 shadow-sm'
                      : 'bg-secondary/20 text-primary/40 cursor-not-allowed'
                  }`}
                >
                  Selanjutnya <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              ) : (
                <button
                  type='button'
                  onClick={handleSave}
                  className='inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg bg-tertiary text-primary hover:bg-tertiary/90 shadow-sm transition'
                >
                  ✓ {editing ? 'Update Produk' : 'Simpan Produk'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== DETAIL MODAL ==================== */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 ${detailProduct ? '' : 'hidden'}`} onClick={(e) => e.target === e.currentTarget && setDetailProduct(null)}>
        <div className="fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className='px-6 pt-6 pb-4 border-b border-secondary/10'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold text-primary'>Detail Produk</h3>
              <button onClick={() => setDetailProduct(null)} className='text-primary/40 hover:text-primary text-sm font-bold'>✕</button>
            </div>
          </div>

          <div className='px-6 py-5 space-y-4'>
            <div>
              <label className='block text-xs font-medium text-primary/50 mb-1'>Nama Produk</label>
              <p className='text-sm font-medium text-primary'>{detailProduct?.name}</p>
            </div>
            <div>
              <label className='block text-xs font-medium text-primary/50 mb-1'>Tipe</label>
              <p className='text-sm text-primary'>{getTypeName(detailProduct?.type_id)}</p>
            </div>
            <div>
              <label className='block text-xs font-medium text-primary/50 mb-1'>Deskripsi</label>
              <p className='text-sm text-primary/70'>{detailProduct?.description || '-'}</p>
            </div>
            <div>
              <label className='block text-xs font-medium text-primary/50 mb-1'>Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${detailProduct?.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {detailProduct?.is_active !== false ? 'Aktif' : 'Non-Aktif'}
              </span>
            </div>

            {/* Variant List in Detail */}
            <div>
              <label className='block text-xs font-medium text-primary/50 mb-2'>Daftar Variant</label>
              {detailProduct?.productvariants && detailProduct.productvariants.length > 0 ? (
                <div className='overflow-x-auto border border-secondary/15 rounded-lg'>
                  <table className='w-full text-sm'>
                    <thead className='bg-quaternary'>
                      <tr>
                        <th className='text-left px-3 py-2 text-xs font-semibold text-primary'>Bentuk</th>
                        <th className='text-left px-3 py-2 text-xs font-semibold text-primary'>Ukuran</th>
                        <th className='text-left px-3 py-2 text-xs font-semibold text-primary'>Rasa</th>
                        <th className='text-right px-3 py-2 text-xs font-semibold text-primary'>Harga</th>
                        <th className='text-center px-3 py-2 text-xs font-semibold text-primary'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailProduct.productvariants.map((v, i) => (
                        <tr key={i} className='border-t border-secondary/10'>
                          <td className='px-3 py-2 text-primary/80'>{getShapeName(v.shape_id)}</td>
                          <td className='px-3 py-2 text-primary/80'>{getSizeName(v.size_id)}</td>
                          <td className='px-3 py-2 text-primary/80'>{getFlavorName(v.flavor_id)}</td>
                          <td className='px-3 py-2 text-right text-primary font-medium'>{formatPrice(v.price)}</td>
                          <td className='px-3 py-2 text-center'>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${v.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              {v.is_active !== false ? 'Aktif' : 'Non-Aktif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className='text-sm text-primary/40 italic'>Belum ada variant</p>
              )}
            </div>
          </div>

          <div className='px-6 pb-6 pt-2 border-t border-secondary/10 flex justify-end'>
            <button onClick={() => setDetailProduct(null)} className='px-4 py-2 text-sm font-medium bg-tertiary text-primary rounded-lg hover:bg-tertiary/90 transition'>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
