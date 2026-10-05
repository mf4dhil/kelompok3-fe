import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Plus, Search, Eye, EyeOff, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/Card';

export default function ProdukAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  // State for form
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    desc: '',
    category: 'favorit',
    status: 'aktif',
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mock data - in production, this would be an API call
        const mockProducts = [
          { id: 1, name: 'Signature Classic', price: 89000, desc: 'Klasik favorit cita semua', category: 'signature', status: 'aktif' },
          { id: 2, name: 'Rainbow Fondant', price: 125000, desc: 'Hasil warna pelangi mewah', category: 'signature', status: 'aktif' },
          { id: 3, name: 'Kue Apel', price: 65000, desc: 'Pelapis renyah & isi manis', category: 'favorit', status: 'aktif' },
          { id: 4, name: 'Oreo Cream', price: 72000, desc: 'Oreo garing & cream lembut', category: 'favorit', status: 'tidak_aktif' },
          { id: 5, name: 'Chocolate Hazelnut', price: 95000, desc: 'Chocolate & hazelnut premium', category: 'signature', status: 'aktif' },
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error('Gagal mengambil data produk:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (editing && currentProduct) {
      // Update product
      const updatedProduct = {
        ...currentProduct,
        name: formData.name,
        price: parseInt(formData.price),
        desc: formData.desc,
        category: formData.category,
      };
      setProducts(products.map((p) => (p.id === currentProduct.id ? updatedProduct : p)));
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        price: parseInt(formData.price),
        desc: formData.desc,
        category: formData.category,
      };
      setProducts([...products, newProduct]);
    }
    setFormVisible(false);
    setFormData({
      name: '',
      price: '',
      desc: '',
      category: 'favorit',
    });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      desc: product.desc,
      category: product.category,
      status: product.status,
    });
    setEditing(true);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleNonaktifkan = (id) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, status: 'tidak_aktif' } : p)));
  };

  const handleAktifkan = (id) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, status: 'aktif' } : p)));
  };

  const handleDetail = (product) => {
    setDetailProduct(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className='flex min-h-screen bg-quaternary'>
      {/* Sidebar */}
      <Sidebar />
      {/* Content */}
      <div className='flex-1 min-w-0'>
        {/* Navbar */}
        <Navbar />
        <main className='p-6'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-primary'>Manajemen Produk</h2>
            <p className='text-primary/60'>Daftar semua produk kue untuk pre-order</p>
          </div>
          <button
            onClick={() => setFormVisible(true)}
            className='inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-tertiary hover:bg-tertiary/90 text-primary transition shadow-sm hover:shadow-tertiary/20 my-4'>
            <Plus className='w-4 h-4 mr-2' /> Tambah Produk
          </button>
          {/* Action Button + Stats */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6'>
            <div className='grid grid-cols-3 gap-4 w-full sm:w-auto'>
              <StatCard title='Total Produk' value={products.length} description='Total produk yang terdaftar' icon='📦' iconColor='bg-[#C86D51]/15' />
              <StatCard title='Signature' value={products.filter((p) => p.category === 'signature').length} description='Produk signature' icon='👑' iconColor='bg-[#C86D51]/15' />
              <StatCard title='Favorit' value={products.filter((p) => p.category === 'favorit').length} description='Produk favorit' icon='🍰' iconColor='bg-[#E8A857]/20' />
            </div>
          </div>

          {/* Products Table */}
          <div className='bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm'>
            <div className='p-5 border-b border-secondary/10'>
              <h2 className='text-lg font-bold text-primary'>Daftar Produk</h2>
              <p className='text-sm text-primary/60'>Kelola produk kue yang tersedia</p>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-quaternary'>
                  <tr>
                    <th className='text-left px-6 py-3 text-xs font-semibold text-primary'>No</th>
                    <th className='text-left px-6 py-3 text-xs font-semibold text-primary'>Nama Produk</th>
                    <th className='text-left px-6 py-3 text-xs font-semibold text-primary'>Harga</th>
                    <th className='text-left px-6 py-3 text-xs font-semibold text-primary'>Kategori</th>
                    <th className='text-left px-6 py-3 text-xs font-semibold text-primary'>Deskripsi</th>
                    <th className='text-left px-6 py-3 text-xs font-semibold text-primary'>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className='border-t border-secondary/10 hover:bg-quaternary/70'>
                      <td className='px-6 py-4 text-sm text-primary'>{index + 1}</td>
                      <td className='px-6 py-4 text-sm font-medium text-primary'>{product.name}</td>
                      <td className='px-6 py-4 text-sm text-primary/70'>{formatPrice(product.price)}</td>
                      <td className='px-6 py-4 text-sm text-primary/70'>{product.category === 'signature' ? 'Signature' : 'Favorit'}</td>
                      <td className='px-6 py-4 text-sm text-primary/70'>{product.desc}</td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2'>
                          <button onClick={() => handleNonaktifkan(product.id)} className='px-3 py-1 rounded text-xs text-primary/70 hover:text-primary transition' title={product.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}>
                            <EyeOff className='w-3 h-3' />
                          </button>
                          <button onClick={() => handleEdit(product)} className='px-3 py-1 rounded text-xs text-primary/70 hover:text-primary transition' title='Edit'>
                            <Eye className='w-3 h-3' />
                          </button>
                          <button onClick={() => handleDetail(product)} className='px-3 py-1 rounded text-xs text-primary/70 hover:text-primary transition' title='Detail'>
                            <MoreVertical className='w-3 h-3' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Modal */}
          <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 ${formVisible ? 'visible' : 'hidden'} transition-opacity duration-300`} onClick={(e) => e.target === e.currentTarget && setFormVisible(false)}>
            <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 ${formVisible ? 'scale-100' : 'scale-90'}" onClick={(e) => e.stopPropagation()}>
              <h3 className='text-xl font-bold text-primary mb-4'>{editing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>

              <form onSubmit={handleSave}>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-primary mb-2'>Nama Produk</label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder='Masukkan nama produk'
                    className='w-full bg-secondary/20 border border-secondary/30 rounded-lg px-4 py-3 text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-primary mb-2'>Harga (Rp)</label>
                  <input
                    type='number'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder='Misal: 89000'
                    className='w-full bg-secondary/20 border border-secondary/30 rounded-lg px-4 py-3 text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-primary mb-2'>Deskripsi</label>
                  <textarea
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    placeholder='Deskripsi produk...'
                    rows={3}
                    className='w-full bg-secondary/20 border border-secondary/30 rounded-lg px-4 py-3 text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent resize-none'
                  />
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-primary mb-2'>Kategori</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, category: 'signature' })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.category === 'signature' ? 'bg-tertiary text-primary shadow-tertiary/30' : 'bg-white border border-secondary/30 text-primary/70 hover:border-tertiary hover:bg-secondary/10'}`}>
                      Signature
                    </button>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, category: 'favorit' })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.category === 'favorit' ? 'bg-tertiary text-primary shadow-tertiary/30' : 'bg-white border border-secondary/30 text-primary/70 hover:border-tertiary hover:bg-secondary/10'}`}>
                      Favorit
                    </button>
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-primary mb-2'>Status</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, status: 'aktif' })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.status === 'aktif' ? 'bg-tertiary text-primary shadow-tertiary/30' : 'bg-white border border-secondary/30 text-primary/70 hover:border-tertiary hover:bg-secondary/10'}`}>
                      Aktif
                    </button>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, status: 'tidak_aktif' })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.status === 'tidak_aktif' ? 'bg-tertiary text-primary shadow-tertiary/30' : 'bg-white border border-secondary/30 text-primary/70 hover:border-tertiary hover:bg-secondary/10'}`}>
                      Tidak Aktif
                    </button>
                  </div>
                </div>

                <div className='flex justify-between pt-4 border-t border-secondary/20'>
                  <button type='button' onClick={() => setFormVisible(false)} className='px-4 py-2 bg-white text-primary/60 hover:text-primary transition rounded-lg'>
                    Batal
                  </button>
                  <button type='submit' className={`px-4 py-2 bg-tertiary hover:bg-tertiary/90 text-primary font-medium rounded-lg transition ${editing ? 'bg-primary' : 'bg-secondary'} ${editing ? 'text-white' : 'text-white'}`}>
                    {editing ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Detail Modal */}
          <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 ${detailProduct ? 'visible' : 'hidden'} transition-opacity duration-300`} onClick={(e) => e.target === e.currentTarget && setDetailProduct(null)}>
            <div className='fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300' onClick={(e) => e.stopPropagation()}>
              <h3 className='text-xl font-bold text-primary mb-4'>Detail Produk</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-medium text-primary/60 mb-1'>Nama Produk</label>
                  <p className='text-sm text-primary'>{detailProduct?.name}</p>
                </div>
                <div>
                  <label className='block text-xs font-medium text-primary/60 mb-1'>Harga</label>
                  <p className='text-sm text-primary'>{detailProduct && formatPrice(detailProduct.price)}</p>
                </div>
                <div>
                  <label className='block text-xs font-medium text-primary/60 mb-1'>Kategori</label>
                  <p className='text-sm text-primary'>{detailProduct?.category === 'signature' ? 'Signature' : 'Favorit'}</p>
                </div>
                <div>
                  <label className='block text-xs font-medium text-primary/60 mb-1'>Status</label>
                  <p className='text-sm text-primary'>
                    {detailProduct?.status === 'aktif' ? (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>Aktif</span>
                    ) : (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>Tidak Aktif</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className='block text-xs font-medium text-primary/60 mb-1'>Deskripsi</label>
                  <p className='text-sm text-primary/70'>{detailProduct?.desc}</p>
                </div>
              </div>
              <div className='flex justify-end mt-6 pt-4 border-t border-secondary/20'>
                <button type='button' onClick={() => setDetailProduct(null)} className='px-4 py-2 bg-tertiary hover:bg-tertiary/90 text-primary font-medium rounded-lg transition'>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
