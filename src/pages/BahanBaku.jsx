import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  Package,
  AlertTriangle,
  Wallet,
  Boxes,
} from 'lucide-react';

export default function BahanBaku() {
  // STATE  
  const [searchQuery, setSearchQuery] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    unit: 'Kg',
    stock: '',
    price: '',
    minimumStock: '',
    status: 'Aktif',
  });

  
  // DUMMY DATA
  // Nanti diganti dengan API backend
  
  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: 'Tepung Terigu',
      unit: 'Kg',
      stock: 25,
      price: 14000,
      minimumStock: 5,
      status: 'Aktif',
    },
    {
      id: 2,
      name: 'Telur',
      unit: 'Butir',
      stock: 100,
      price: 2000,
      minimumStock: 20,
      status: 'Aktif',
    },
    {
      id: 3,
      name: 'Gula Pasir',
      unit: 'Kg',
      stock: 15,
      price: 17000,
      minimumStock: 5,
      status: 'Aktif',
    },
    {
      id: 4,
      name: 'Coklat Compound',
      unit: 'Kg',
      stock: 3,
      price: 80000,
      minimumStock: 5,
      status: 'Aktif',
    },
    {
      id: 5,
      name: 'Butter',
      unit: 'Kg',
      stock: 0,
      price: 95000,
      minimumStock: 3,
      status: 'Tidak Aktif',
    },
  ]);

  
  // FORMAT RUPIAH
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  
  // FILTER
  
  const filteredMaterials = useMemo(() => {
    const search = searchQuery.toLowerCase();

    return materials.filter((material) =>
      material.name.toLowerCase().includes(search)
    );
  }, [materials, searchQuery]);

  
  // STATISTICS
  
  const totalMaterials = materials.length;

  const lowStockMaterials = materials.filter(
    (material) =>
      material.stock > 0 &&
      material.stock <= material.minimumStock
  ).length;

  const emptyStockMaterials = materials.filter(
    (material) => material.stock === 0
  ).length;

  const totalInventoryValue = materials.reduce(
    (total, material) =>
      total + material.stock * material.price,
    0
  );

  
  // OPEN ADD FORM
  
  const handleAdd = () => {
    setSelectedMaterial(null);

    setFormData({
      name: '',
      unit: 'Kg',
      stock: '',
      price: '',
      minimumStock: '',
      status: 'Aktif',
    });

    setShowForm(true);
  };

  
  // OPEN EDIT FORM
  
  const handleEdit = (material) => {
    setSelectedMaterial(material);

    setFormData({
      name: material.name,
      unit: material.unit,
      stock: material.stock,
      price: material.price,
      minimumStock: material.minimumStock,
      status: material.status,
    });

    setShowForm(true);
  };

  
  // FORM INPUT
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  // SAVE
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Nama bahan baku wajib diisi.');
      return;
    }

    if (formData.stock === '') {
      alert('Stok wajib diisi.');
      return;
    }

    if (formData.price === '') {
      alert('Harga wajib diisi.');
      return;
    }

    if (formData.minimumStock === '') {
      alert('Minimum stok wajib diisi.');
      return;
    }

    const materialData = {
      name: formData.name,
      unit: formData.unit,
      stock: Number(formData.stock),
      price: Number(formData.price),
      minimumStock: Number(formData.minimumStock),
      status: formData.status,
    };

    // EDIT
    if (selectedMaterial) {
      setMaterials((prev) =>
        prev.map((material) =>
          material.id === selectedMaterial.id
            ? {
                ...material,
                ...materialData,
              }
            : material
        )
      );
    }

    // TAMBAH
    else {
      const newMaterial = {
        id: Date.now(),
        ...materialData,
      };

      setMaterials((prev) => [...prev, newMaterial]);
    }

    setShowForm(false);
    setSelectedMaterial(null);
  };

  
  // OPEN DELETE
  
  const handleDeleteClick = (material) => {
    setSelectedMaterial(material);
    setShowDelete(true);
  };

  
  // DELETE
  
  const handleDeleteConfirm = () => {
    if (!selectedMaterial) return;

    setMaterials((prev) =>
      prev.filter(
        (material) => material.id !== selectedMaterial.id
      )
    );

    setSelectedMaterial(null);
    setShowDelete(false);
  };

  
  // DETAIL
  
  const handleDetail = (material) => {
    setSelectedMaterial(material);
    setShowDetail(true);
  };

  
  // STOCK STATUS
  
  const getStockStatus = (material) => {
    if (material.stock === 0) {
      return {
        label: 'Habis',
        className: 'bg-red-50 text-red-600',
      };
    }

    if (material.stock <= material.minimumStock) {
      return {
        label: 'Menipis',
        className: 'bg-yellow-50 text-yellow-600',
      };
    }

    return {
      label: 'Aman',
      className: 'bg-green-50 text-green-600',
    };
  };

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bahan Baku
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola data bahan baku dan stok bahan produksi.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Tambah Bahan Baku
        </button>

      </div>

      {/* ================= STATISTICS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Total Bahan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Bahan
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {totalMaterials}
              </h2>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <Boxes className="w-6 h-6 text-blue-600" />
            </div>

          </div>

        </div>

        {/* Stok Menipis */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Stok Menipis
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {lowStockMaterials}
              </h2>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>

          </div>

        </div>

        {/* Stok Habis */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Stok Habis
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {emptyStockMaterials}
              </h2>
            </div>

            <div className="p-3 bg-red-50 rounded-lg">
              <Package className="w-6 h-6 text-red-600" />
            </div>

          </div>

        </div>

        {/* Nilai Persediaan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Nilai Persediaan
              </p>

              <h2 className="text-lg font-bold text-gray-800 mt-1">
                {formatPrice(totalInventoryValue)}
              </h2>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>

          </div>

        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200">

        {/* Search */}
        <div className="p-5 border-b border-gray-200">

          <div className="relative max-w-md">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari nama bahan baku..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  No
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Nama Bahan
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Satuan
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Stok
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Harga / Satuan
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Kondisi
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Aksi
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredMaterials.length > 0 ? (

                filteredMaterials.map((material, index) => {

                  const stockStatus =
                    getStockStatus(material);

                  return (
                    <tr
                      key={material.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Package
                              size={19}
                              className="text-blue-600"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {material.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Min. stok: {material.minimumStock}{' '}
                              {material.unit}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-center text-sm text-gray-600">
                        {material.unit}
                      </td>

                      <td className="px-5 py-4 text-center">

                        <span className="font-medium text-gray-800">
                          {material.stock}
                        </span>

                        <span className="text-xs text-gray-500 ml-1">
                          {material.unit}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right text-sm font-medium text-gray-800">
                        {formatPrice(material.price)}
                      </td>

                      <td className="px-5 py-4 text-center">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${stockStatus.className}`}
                        >
                          {stockStatus.label}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            material.status === 'Aktif'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {material.status}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-center gap-1">

                          {/* Detail */}
                          <button
                            onClick={() =>
                              handleDetail(material)
                            }
                            title="Detail"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye size={17} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() =>
                              handleEdit(material)
                            }
                            title="Edit"
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          >
                            <Pencil size={17} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDeleteClick(material)
                            }
                            title="Hapus"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Bahan baku tidak ditemukan.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <MaterialFormModal
          formData={formData}
          isEdit={Boolean(selectedMaterial)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedMaterial(null);
          }}
        />
      )}

      {/* ================= DETAIL MODAL ================= */}
      {showDetail && selectedMaterial && (
        <MaterialDetailModal
          material={selectedMaterial}
          formatPrice={formatPrice}
          getStockStatus={getStockStatus}
          onClose={() => {
            setShowDetail(false);
            setSelectedMaterial(null);
          }}
        />
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDelete && selectedMaterial && (
        <DeleteModal
          material={selectedMaterial}
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setShowDelete(false);
            setSelectedMaterial(null);
          }}
        />
      )}

    </div>
  );
}

// FORM MODAL


function MaterialFormModal({
  formData,
  isEdit,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {isEdit
                ? 'Edit Bahan Baku'
                : 'Tambah Bahan Baku'}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? 'Perbarui informasi bahan baku.'
                : 'Masukkan informasi bahan baku baru.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>

          <div className="p-6 space-y-4">

            {/* Nama */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Bahan Baku
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Contoh: Tepung Terigu"
                className="w-full px-3 py-2.5 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Satuan */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Satuan
              </label>

              <select
                name="unit"
                value={formData.unit}
                onChange={onChange}
                className="w-full px-3 py-2.5 border border-gray-300 text-primary rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Kg">Kg</option>
                <option value="Gram">Gram</option>
                <option value="Liter">Liter</option>
                <option value="Ml">Ml</option>
                <option value="Butir">Butir</option>
                <option value="Pcs">Pcs</option>
                <option value="Pack">Pack</option>
              </select>

            </div>

            {/* Stok & Minimum */}
            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stok
                </label>

                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={onChange}
                  placeholder="0"
                  className="w-full px-3 py-2.5 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Minimum Stok
                </label>

                <input
                  type="number"
                  min="0"
                  name="minimumStock"
                  value={formData.minimumStock}
                  onChange={onChange}
                  placeholder="0"
                  className="w-full px-3 py-2.5 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Harga */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Harga per Satuan
              </label>

              <input
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={onChange}
                placeholder="Contoh: 14000"
                className="w-full px-3 py-2.5 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Status */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                className="w-full px-3 py-2.5 border border-gray-300 text-primary rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">
                  Tidak Aktif
                </option>
              </select>

            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isEdit ? 'Simpan Perubahan' : 'Simpan'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

// DETAIL MODAL


function MaterialDetailModal({
  material,
  formatPrice,
  getStockStatus,
  onClose,
}) {
  const stockStatus = getStockStatus(material);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b">

          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors mb-4"
          >
            <ArrowLeft size={17} />
            Kembali ke Daftar Bahan
          </button>

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Detail Bahan Baku
              </h2>

              <p className="text-sm text-gray-500">
                Informasi bahan dan kondisi stok
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
              title="Tutup"
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* Content */}
        <div className="p-6">

          {/* Icon & Name */}
          <div className="flex items-center gap-4 mb-6">

            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package
                size={28}
                className="text-blue-600"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {material.name}
              </h3>

              <span
                className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-medium ${stockStatus.className}`}
              >
                Stok {stockStatus.label}
              </span>
            </div>

          </div>

          {/* Detail */}
          <div className="space-y-3">

            <div className="flex justify-between border-b pb-3">
              <span className="text-sm text-gray-500">
                Satuan
              </span>

              <span className="text-sm font-medium text-gray-800">
                {material.unit}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-sm text-gray-500">
                Stok Saat Ini
              </span>

              <span className="text-sm font-medium text-gray-800">
                {material.stock} {material.unit}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-sm text-gray-500">
                Minimum Stok
              </span>

              <span className="text-sm font-medium text-gray-800">
                {material.minimumStock} {material.unit}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-sm text-gray-500">
                Harga / Satuan
              </span>

              <span className="text-sm font-medium text-gray-800">
                {formatPrice(material.price)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                Nilai Persediaan
              </span>

              <span className="text-sm font-bold text-gray-800">
                {formatPrice(
                  material.stock * material.price
                )}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// DELETE MODAL

function DeleteModal({
  material,
  onConfirm,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">

      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">

        <div className="p-6">

          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Trash2
              size={22}
              className="text-red-600"
            />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Hapus Bahan Baku?
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Apakah kamu yakin ingin menghapus bahan
            <span className="font-semibold text-gray-700">
              {' '}
              "{material.name}"
            </span>
            ? Data yang sudah dihapus tidak dapat
            dikembalikan.
          </p>

        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">

          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Hapus
          </button>

        </div>

      </div>

    </div>
  );
}