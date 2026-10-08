import React, { useMemo, useState } from 'react';
import {
  Search,
  Eye,
  X,
  Users,
  UserCheck,
  ShoppingBag,
  Wallet,
} from 'lucide-react';

export default function Pelanggan() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // =========================
  // DUMMY DATA PELANGGAN
  // Nanti diganti dengan data dari backend
  // =========================
  const customers = [
    {
      id: 1,
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      phone: '081234567890',
      status: 'Aktif',
      totalOrders: 5,
      totalSpent: 450000,
      orders: [
        {
          id: 'PO-001',
          date: '2026-09-15',
          total: 85000,
          status: 'Selesai',
          items: [
            {
              name: 'Signature Classic',
              variant: 'Medium - Chocolate',
              quantity: 1,
              price: 85000,
            },
          ],
        },
        {
          id: 'PO-008',
          date: '2026-09-22',
          total: 125000,
          status: 'Selesai',
          items: [
            {
              name: 'Birthday Cake',
              variant: 'Large - Vanilla',
              quantity: 1,
              price: 125000,
            },
          ],
        },
        {
          id: 'PO-015',
          date: '2026-10-01',
          total: 240000,
          status: 'Diproses',
          items: [
            {
              name: 'Chocolate Cake',
              variant: 'Large - Chocolate',
              quantity: 2,
              price: 120000,
            },
          ],
        },
      ],
    },

    {
      id: 2,
      name: 'Siti Rahma',
      email: 'siti@gmail.com',
      phone: '082345678901',
      status: 'Aktif',
      totalOrders: 3,
      totalSpent: 275000,
      orders: [
        {
          id: 'PO-003',
          date: '2026-09-18',
          total: 90000,
          status: 'Selesai',
          items: [
            {
              name: 'Red Velvet',
              variant: 'Medium - Red Velvet',
              quantity: 1,
              price: 90000,
            },
          ],
        },
        {
          id: 'PO-011',
          date: '2026-09-28',
          total: 85000,
          status: 'Selesai',
          items: [
            {
              name: 'Signature Classic',
              variant: 'Medium - Chocolate',
              quantity: 1,
              price: 85000,
            },
          ],
        },
        {
          id: 'PO-017',
          date: '2026-10-03',
          total: 100000,
          status: 'Diproses',
          items: [
            {
              name: 'Birthday Cake',
              variant: 'Medium - Vanilla',
              quantity: 1,
              price: 100000,
            },
          ],
        },
      ],
    },

    {
      id: 3,
      name: 'Andi Wijaya',
      email: 'andi@gmail.com',
      phone: '083456789012',
      status: 'Aktif',
      totalOrders: 2,
      totalSpent: 180000,
      orders: [
        {
          id: 'PO-005',
          date: '2026-09-20',
          total: 90000,
          status: 'Selesai',
          items: [
            {
              name: 'Red Velvet',
              variant: 'Medium - Red Velvet',
              quantity: 1,
              price: 90000,
            },
          ],
        },
        {
          id: 'PO-013',
          date: '2026-10-02',
          total: 90000,
          status: 'Selesai',
          items: [
            {
              name: 'Red Velvet',
              variant: 'Medium - Red Velvet',
              quantity: 1,
              price: 90000,
            },
          ],
        },
      ],
    },

    {
      id: 4,
      name: 'Rina Amelia',
      email: 'rina@gmail.com',
      phone: '084567890123',
      status: 'Tidak Aktif',
      totalOrders: 1,
      totalSpent: 75000,
      orders: [
        {
          id: 'PO-002',
          date: '2026-08-30',
          total: 75000,
          status: 'Selesai',
          items: [
            {
              name: 'Mini Cake',
              variant: 'Small - Vanilla',
              quantity: 1,
              price: 75000,
            },
          ],
        },
      ],
    },
  ];

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // =========================
  // FORMAT TANGGAL
  // =========================
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // =========================
  // FILTER PELANGGAN
  // =========================
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search = searchQuery.toLowerCase();

      return (
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.includes(search)
      );
    });
  }, [searchQuery]);

  // =========================
  // STATISTIK
  // =========================
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === 'Aktif'
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.totalOrders,
    0
  );

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Pelanggan
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Kelola data pelanggan dan lihat riwayat pesanan pelanggan.
        </p>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Total Pelanggan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Pelanggan
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {totalCustomers}
              </h2>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pelanggan Aktif */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pelanggan Aktif
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {activeCustomers}
              </h2>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Pesanan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Pesanan
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {totalOrders}
              </h2>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Pendapatan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Belanja
              </p>

              <h2 className="text-xl font-bold text-gray-800 mt-1">
                {formatPrice(totalRevenue)}
              </h2>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <Wallet className="w-6 h-6 text-orange-600" />
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
              placeholder="Cari nama, email, atau nomor HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Pelanggan
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  No. HP
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Pesanan
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Total Belanja
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

              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (

                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {customer.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {customer.email}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {customer.phone}
                    </td>

                    {/* Orders */}
                    <td className="px-5 py-4 text-center">

                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                        {customer.totalOrders}
                      </span>

                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 text-right text-sm font-medium text-gray-800">
                      {formatPrice(customer.totalSpent)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'Aktif'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {customer.status}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-center">

                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye size={16} />
                        Detail
                      </button>

                    </td>

                  </tr>

                ))
              ) : (

                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Pelanggan tidak ditemukan.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= DETAIL MODAL ================= */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          formatPrice={formatPrice}
          formatDate={formatDate}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

    </div>
  );
}

// DETAIL PELANGGAN
function CustomerDetailModal({
  customer,
  formatPrice,
  formatDate,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Detail Pelanggan
            </h2>

            <p className="text-sm text-gray-500">
              Informasi pelanggan dan riwayat pesanan
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-600 "
          >
            <X size={20} />
          </button>

        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">

          {/* Customer Information */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">

            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {customer.name}
              </h3>

              <p className="text-sm text-gray-500">
                {customer.email}
              </p>

              <p className="text-sm text-gray-500">
                {customer.phone}
              </p>
            </div>

          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Total Pesanan
              </p>

              <p className="text-xl font-bold text-gray-800 mt-1">
                {customer.totalOrders}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Total Belanja
              </p>

              <p className="text-xl font-bold text-gray-800 mt-1">
                {formatPrice(customer.totalSpent)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'Aktif'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {customer.status}
              </span>
            </div>

          </div>

          {/* Order History */}
          <div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Riwayat Pesanan
            </h3>

            <div className="space-y-4">

              {customer.orders.map((order) => (

                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4"
                >

                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">

                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.id}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatDate(order.date)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Selesai'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {order.status}
                      </span>

                      <span className="font-semibold text-gray-800">
                        {formatPrice(order.total)}
                      </span>

                    </div>

                  </div>

                  {/* Items */}
                  <div className="space-y-2">

                    {order.items.map((item, index) => (

                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.variant}
                          </p>
                        </div>

                        <div className="text-right">

                          <p className="text-xs text-gray-500">
                            x{item.quantity}
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {formatPrice(item.price)}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}