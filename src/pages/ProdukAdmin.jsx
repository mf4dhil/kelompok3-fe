import React, { useState, useEffect } from 'react';
import { Edit, Delete, Plus, Eye, EyeOff, MoreVertical, ChevronRight, ChevronLeft } from 'lucide-react';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  addProductVariants,
} from '../services/productService';
import { getShapes, getSizes, getFlavors, getTypes } from '../services/masterService';

// Step constants for variant modal
const STEPS = {
  PRODUCT: 1,
  SHAPE: 2,
  SIZE: 3,
  FLAVOR: 4,
  VARIANTS: 5,
};

const STEP_LABELS = {
  [STEPS.PRODUCT]: 'Pilih Produk',
  [STEPS.SHAPE]: 'Pilih Bentuk',
  [STEPS.SIZE]: 'Pilih Ukuran',
  [STEPS.FLAVOR]: 'Pilih Rasa',
  [STEPS.VARIANTS]: 'Atur Variant & Harga',
};

export default function ProdukAdmin() {
  // Products list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState(null);

  // Product modal (simple add/edit)
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    type_id: '',
    is_active: true,
  });

  // Variant modal (multi-step add variants)
  const [variantModalVisible, setVariantModalVisible] = useState(false);
  const [variantStep, setVariantStep] = useState(STEPS.PRODUCT);
  const [selectedProductId, setSelectedProductId] = useState('');
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

  // Fetch master data
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // ========== PRODUCT MODAL (Simple Add/Edit) ==========
  const openProductModal = (product = null) => {
    fetchMasterData();
    if (product) {
      setEditingProduct(true);
      setCurrentProductId(product.id);
      setProductForm({
        name: product.name,
        description: product.description || '',
        type_id: product.type_id || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
    } else {
      setEditingProduct(false);
      setCurrentProductId(null);
      setProductForm({ name: '', description: '', type_id: '', is_active: true });
    }
    setProductModalVisible(true);
  };

  const closeProductModal = () => {
    setProductModalVisible(false);
    setEditingProduct(false);
    setCurrentProductId(null);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      alert('Nama produk wajib diisi');
      return;
    }
    if (!productForm.type_id) {
      alert('Tipe produk wajib dipilih');
      return;
    }

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        type_id: parseInt(productForm.type_id),
        is_active: productForm.is_active,
      };

      if (editingProduct && currentProductId) {
        await updateProduct(currentProductId, payload);
      } else {
        await createProduct(payload);
      }

      closeProductModal();
      await fetchProducts();
    } catch (error) {
      console.error('Gagal menyimpan produk:', error);
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  // ========== VARIANT MODAL (Multi-step Add Variants) ==========
  const openVariantModal = () => {
    fetchMasterData();
    setVariantStep(STEPS.PRODUCT);
    setSelectedProductId('');
    setSelectedShapes([]);
    setSelectedSizes([]);
    setSelectedFlavors([]);
    setGeneratedVariants([]);
    setVariantModalVisible(true);
  };

  const closeVariantModal = () => {
    setVariantModalVisible(false);
    setVariantStep(STEPS.PRODUCT);
    setSelectedProductId('');
    setSelectedShapes([]);
    setSelectedSizes([]);
    setSelectedFlavors([]);
    setGeneratedVariants([]);
  };

  const getExistingVariantsForSelectedProduct = () => {
    const product = products.find(p => p.id === parseInt(selectedProductId));
    return product?.productvariants || [];
  };

  const generateCombinations = () => {
    if (selectedShapes.length === 0 || selectedSizes.length === 0 || selectedFlavors.length === 0) {
      alert('Pilih minimal satu bentuk, ukuran, dan rasa');
      return;
    }

    const existing = getExistingVariantsForSelectedProduct();
    const existingSet = new Set(
      existing.map(v => `${v.shape_id}-${v.size_id}-${v.flavor_id}`)
    );

    const combos = [];
    for (const shapeId of selectedShapes) {
      for (const sizeId of selectedSizes) {
        for (const flavorId of selectedFlavors) {
          const key = `${shapeId}-${sizeId}-${flavorId}`;
          if (!existingSet.has(key)) {
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
    setGeneratedVariants(combos);
    setVariantStep(STEPS.VARIANTS);
  };

  const toggleVariantActive = (index) => {
    setGeneratedVariants(prev =>
      prev.map((v, i) => (i === index ? { ...v, is_active: !v.is_active } : v))
    );
  };

  const updateVariantPrice = (index, price) => {
    setGeneratedVariants(prev =>
      prev.map((v, i) => (i === index ? { ...v, price: parseInt(price) || 0 } : v))
    );
  };

  const handleSaveVariants = async () => {
    if (!selectedProductId) {
      alert('Pilih produk terlebih dahulu');
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
      await addProductVariants(parseInt(selectedProductId), activeVariants);
      closeVariantModal();
      await fetchProducts();
    } catch (error) {
      console.error('Gagal menambahkan variant:', error);
      alert('Gagal menambahkan variant: ' + (error.response?.data?.message || error.message));
    }
  };

  // Step navigation for variant modal
  const canGoNextVariant = () => {
    switch (variantStep) {
      case STEPS.PRODUCT:
        return !!selectedProductId;
      case STEPS.SHAPE:
        return selectedShapes.length > 0;
      case STEPS.SIZE:
        return selectedSizes.length > 0;
      case STEPS.FLAVOR:
        return selectedFlavors.length > 0;
      default:
        return true;
    }
  };

  const goNextVariant = () => {
    if (variantStep < STEPS.VARIANTS) {
      if (variantStep === STEPS.FLAVOR) {
        generateCombinations();
      } else {
        setVariantStep(s => s + 1);
      }
    }
  };

  const goPrevVariant = () => {
    if (variantStep > STEPS.PRODUCT) {
      setVariantStep(s => s - 1);
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

  // ========== PRODUCT TABLE ACTIONS ==========
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
  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
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

  return (
    <>
      {/* Header */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-primary'>Manajemen Produk</h2>
          <p className='text-primary/60'>Kelola produk kue dan varian harganya</p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => openProductModal()}
            className='inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-tertiary hover:bg-tertiary/90 text-primary transition shadow-sm hover:shadow-tertiary/20'
          >
            <Plus className='w-4 h-4 mr-2' /> Tambah Produk
          </button>
          <button
            onClick={openVariantModal}
            className='inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-tertiary text-tertiary hover:bg-tertiary/10 transition shadow-sm'
          >
            <Plus className='w-4 h-4 mr-2' /> Tambah Variant
          </button>
        </div>
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
          <h2 className='text-lg font-bold text-primary'>Daftar Produk</h2>
          <p className='text-sm text-primary/60'>Kelola produk kue yang tersedia</p>
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
                ) : (
                  products.map((product, index) => (
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
                          <button onClick={() => openProductModal(product)} className='p-1.5 rounded hover:bg-secondary/30 text-primary/70 hover:text-primary transition' title='Edit'>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== PRODUCT MODAL (Simple Add/Edit) ==================== */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 ${productModalVisible ? '' : 'hidden'}`} onClick={(e) => e.target === e.currentTarget && closeProductModal()}>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className='px-6 pt-6 pb-4 border-b border-secondary/10'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold text-primary'>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={closeProductModal} className='text-primary/40 hover:text-primary text-sm font-bold'>✕</button>
            </div>
          </div>
          <div className='px-6 py-5 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-primary mb-1.5'>Nama Produk <span className='text-red-500'>*</span></label>
              <input
                type='text'
                value={productForm.name}
                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                placeholder='Contoh: Bolu Gulung'
                className='w-full bg-secondary/10 border border-secondary/25 rounded-lg px-4 py-2.5 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent'
                autoFocus
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-primary mb-1.5'>Deskripsi</label>
              <textarea
                value={productForm.description}
                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                placeholder='Deskripsi singkat produk...'
                rows={3}
                className='w-full bg-secondary/10 border border-secondary/25 rounded-lg px-4 py-2.5 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent resize-none'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-primary mb-1.5'>Tipe Produk <span className='text-red-500'>*</span></label>
              <select
                value={productForm.type_id}
                onChange={e => setProductForm({ ...productForm, type_id: e.target.value })}
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
                  onClick={() => setProductForm({ ...productForm, is_active: true })}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${productForm.is_active ? 'bg-green-500 text-white' : 'bg-secondary/10 text-primary/70 hover:bg-secondary/20'}`}
                >
                  Aktif
                </button>
                <button
                  type='button'
                  onClick={() => setProductForm({ ...productForm, is_active: false })}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!productForm.is_active ? 'bg-red-500 text-white' : 'bg-secondary/10 text-primary/70 hover:bg-secondary/20'}`}
                >
                  Non-Aktif
                </button>
              </div>
            </div>
          </div>
          <div className='px-6 pb-6 pt-2 border-t border-secondary/10 flex justify-end gap-2'>
            <button onClick={closeProductModal} className='px-4 py-2 text-sm font-medium text-primary/60 hover:text-primary border border-secondary/25 rounded-lg hover:bg-secondary/10 transition'>
              Batal
            </button>
            <button onClick={handleSaveProduct} className='px-5 py-2 text-sm font-medium rounded-lg bg-tertiary text-primary hover:bg-tertiary/90 shadow-sm transition'>
              {editingProduct ? 'Update Produk' : 'Simpan Produk'}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== VARIANT MODAL (Multi-step Add Variants) ==================== */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 ${variantModalVisible ? '' : 'hidden'}`} onClick={(e) => e.target === e.currentTarget && closeVariantModal()}>
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className='sticky top-0 bg-white z-10 px-6 pt-6 pb-3 border-b border-secondary/10'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-xl font-bold text-primary'>Tambah Variant Produk</h3>
              <button onClick={closeVariantModal} className='text-primary/40 hover:text-primary text-sm font-bold'>✕</button>
            </div>
            {/* Step Indicator */}
            <div className='flex items-center gap-1'>
              {Object.entries(STEP_LABELS).map(([step, label]) => {
                const stepNum = parseInt(step);
                const isActive = stepNum === variantStep;
                const isDone = stepNum < variantStep;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${isActive ? 'bg-tertiary text-primary' : isDone ? 'bg-green-100 text-green-700' : 'bg-secondary/20 text-primary/40'}`}>
                      {isDone ? '✓' : stepNum}
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                    {stepNum < Object.keys(STEPS).length && <div className={`w-4 h-px ${stepNum < variantStep ? 'bg-green-400' : 'bg-secondary/20'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Modal Body - Step Content */}
          <div className='px-6 py-5'>
            {/* ===== STEP 1: Pilih Produk ===== */}
            {variantStep === STEPS.PRODUCT && (
              <div className='space-y-4'>
                <p className='text-sm text-primary/60'>Pilih produk yang ingin ditambahkan variantnya:</p>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className='w-full bg-secondary/10 border border-secondary/25 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent'
                >
                  <option value=''>-- Pilih Produk --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {selectedProductId && (
                  <div className='p-3 bg-blue-50 rounded-lg text-xs text-blue-700'>
                    <p className='font-medium'>Produk terpilih: {products.find(p => p.id === parseInt(selectedProductId))?.name}</p>
                    <p className='mt-1'>Variant existing: {getExistingVariantsForSelectedProduct().length} varian</p>
                  </div>
                )}
              </div>
            )}

            {/* ===== STEP 2: Pilih Shape ===== */}
            {variantStep === STEPS.SHAPE && (
              <div>
                <p className='text-sm text-primary/60 mb-3'>Pilih bentuk yang ingin ditambahkan:</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {shapes.map(shape => (
                    <button
                      key={shape.id}
                      type='button'
                      onClick={() => toggleShape(shape.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${selectedShapes.includes(shape.id) ? 'border-tertiary bg-tertiary text-primary shadow-sm' : 'border-secondary/20 bg-white text-primary/70 hover:border-tertiary/50 hover:bg-secondary/5'}`}
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
            {variantStep === STEPS.SIZE && (
              <div>
                <p className='text-sm text-primary/60 mb-3'>Pilih ukuran yang ingin ditambahkan:</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {sizes.map(size => (
                    <button
                      key={size.id}
                      type='button'
                      onClick={() => toggleSize(size.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${selectedSizes.includes(size.id) ? 'border-tertiary bg-tertiary text-primary shadow-sm' : 'border-secondary/20 bg-white text-primary/70 hover:border-tertiary/50 hover:bg-secondary/5'}`}
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
            {variantStep === STEPS.FLAVOR && (
              <div>
                <p className='text-sm text-primary/60 mb-3'>Pilih rasa yang ingin ditambahkan:</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {flavors.map(flavor => (
                    <button
                      key={flavor.id}
                      type='button'
                      onClick={() => toggleFlavor(flavor.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${selectedFlavors.includes(flavor.id) ? 'border-tertiary bg-tertiary text-primary shadow-sm' : 'border-secondary/20 bg-white text-primary/70 hover:border-tertiary/50 hover:bg-secondary/5'}`}
                    >
                      {flavor.name}
                    </button>
                  ))}
                </div>
                {selectedFlavors.length === 0 && (
                  <p className='text-xs text-amber-600 mt-2'>⚠ Pilih minimal satu rasa</p>
                )}
                <div className='mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700'>
                  💡 Kombinasi yang sudah ada untuk produk ini akan otomatis di-disable.
                </div>
              </div>
            )}

            {/* ===== STEP 5: Atur Variants & Harga ===== */}
            {variantStep === STEPS.VARIANTS && (
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <p className='text-sm text-primary/60'>
                    Kombinasi variant baru ({generatedVariants.length}):
                  </p>
                </div>
                {generatedVariants.length === 0 ? (
                  <div className='text-center py-8 text-primary/40'>
                    <p>Tidak ada kombinasi baru yang tersedia.</p>
                    <p className='text-xs mt-1'>Semua kombinasi dari pilihan ini sudah ada untuk produk tersebut.</p>
                    <button
                      type='button'
                      onClick={() => setVariantStep(STEPS.FLAVOR)}
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
              {variantStep > STEPS.PRODUCT && (
                <button
                  type='button'
                  onClick={goPrevVariant}
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-primary/70 hover:text-primary border border-secondary/25 rounded-lg hover:bg-secondary/10 transition'
                >
                  <ChevronLeft className='w-4 h-4 mr-1' /> Sebelumnya
                </button>
              )}
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={closeVariantModal}
                className='px-4 py-2 text-sm font-medium text-primary/60 hover:text-primary border border-secondary/25 rounded-lg hover:bg-secondary/10 transition'
              >
                Batal
              </button>
              {variantStep < STEPS.VARIANTS ? (
                <button
                  type='button'
                  onClick={goNextVariant}
                  disabled={!canGoNextVariant()}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition ${canGoNextVariant() ? 'bg-tertiary text-primary hover:bg-tertiary/90 shadow-sm' : 'bg-secondary/20 text-primary/40 cursor-not-allowed'}`}
                >
                  Selanjutnya <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              ) : (
                <button
                  type='button'
                  onClick={handleSaveVariants}
                  disabled={generatedVariants.length === 0}
                  className={`inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg transition ${generatedVariants.length > 0 ? 'bg-tertiary text-primary hover:bg-tertiary/90 shadow-sm' : 'bg-secondary/20 text-primary/40 cursor-not-allowed'}`}
                >
                  ✓ Simpan Variant
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
            <div>
              <label className='block text-xs font-medium text-primary/50 mb-1'>Daftar Variant</label>
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
