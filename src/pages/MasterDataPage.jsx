import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const masterMenus = [
  { path: '/master-data/products', name: 'Products', desc: 'Kelola produk kue & varian', icon: '🍰' },
  { path: '/master-data/categories', name: 'Categories', desc: 'Kelola kategori kue', icon: '🏷️' },
  { path: '/master-data/types', name: 'Types', desc: 'Kelola tipe kue per kategori', icon: '📦' },
  { path: '/master-data/flavors', name: 'Flavors', desc: 'Kelola rasa kue', icon: '🍫' },
  { path: '/master-data/shapes', name: 'Shapes', desc: 'Kelola bentuk kue', icon: '⭕' },
  { path: '/master-data/sizes', name: 'Sizes', desc: 'Kelola ukuran kue', icon: '📐' },
  { path: '/master-data/rekenings', name: 'Rekenings', desc: 'Kelola rekening bank', icon: '🏦' },
];

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Master Data</h1>
        <p className="text-primary/60 text-sm">
          Pilih menu di bawah untuk mengelola data master aplikasi.
        </p>
      </div>

      {/* Jika ada child route yang aktif, tampilkan Outlet (halaman CRUD) */}
      <div className="border-b border-secondary/15 pb-4">
        <Link
          to="/master-data"
          className="text-sm text-tertiary hover:underline"
        >
          ← Kembali ke Menu Master Data
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {masterMenus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className="block bg-white border border-secondary/20 rounded-xl p-5 hover:border-tertiary hover:shadow-md transition group"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{menu.icon}</div>
              <div>
                <h3 className="font-bold text-primary group-hover:text-tertiary transition">
                  {menu.name}
                </h3>
                <p className="text-xs text-primary/60 mt-1">{menu.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Outlet untuk nested routes (CRUD page) */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
