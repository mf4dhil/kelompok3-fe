import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuClass = (path) => {
    if (location.pathname === path) {
      return "block px-4 py-3 rounded-lg bg-[#C86D51] text-white";
    }

    return "block px-4 py-3 rounded-lg hover:bg-[#C86D51] transition";
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-[#2B1B17] text-white z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className='h-20 flex items-center justify-between px-6 border-b border-white/10'>
        <div>
          <h1 className='text-2xl font-bold'>CakeOrder</h1>
          <p className='text-xs text-[#FAF5EE]/70'>Pre-Order Kue</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-white/70 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Menu - Scrollable Area */}
      <div className='p-4 flex-1 overflow-y-auto'>
        <p className='text-xs text-[#FAF5EE]/50 mb-3'>MENU UTAMA</p>
        <ul className='space-y-2'>
          <li>
            <Link
              to="/dashboard"
              onClick={onClose}
              className={menuClass("/dashboard")}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/users"
              onClick={onClose}
              className={menuClass("/users")}
            >
              User
            </Link>
          </li>

          <li>
            <Link
              to="/produk-admin"
              onClick={onClose}
              className={menuClass("/produk-admin")}
            >
              Produk Kue
            </Link>
          </li>

          <li>
            <Link
              to="/master-data"
              onClick={onClose}
              className={menuClass("/master-data")}
            >
              Master Data
            </Link>
          </li>

          <li>
            <Link
              to="/preorder"
              onClick={onClose}
              className={menuClass("/preorder")}
            >
              Pre-Order
            </Link>
          </li>

          <li>
            <Link
              to="/pelanggan"
              onClick={onClose}
              className={menuClass("/pelanggan")}
            >
              Pelanggan
            </Link>
          </li>

          <li>
            <Link
              to="/laporan"
              onClick={onClose}
              className={menuClass("/laporan")}
            >
              Laporan
            </Link>
          </li>
        </ul>

        {/* Inventory Section */}
        <p className='text-xs text-[#FAF5EE]/50 mt-6 mb-2'>INVENTORY</p>
        <ul className='space-y-2'>
          <li>
            <Link to="/materials" onClick={onClose} className={menuClass("/materials")}>
              Bahan Baku
            </Link>
          </li>
          <li>
            <Link to="/materials/low-stock" onClick={onClose} className={menuClass("/materials/low-stock")}>
              Stok Rendah
            </Link>
          </li>
          <li>
            <Link to="/material-purchases" onClick={onClose} className={menuClass("/material-purchases")}>
              Pembelian Bahan
            </Link>
          </li>
        </ul>

        {/* Finance Section */}
        <p className='text-xs text-[#FAF5EE]/50 mt-6 mb-2'>KEUANGAN</p>
        <ul className='space-y-2 pb-6'>
          <li>
            <Link to="/expense-categories" onClick={onClose} className={menuClass("/expense-categories")}>
              Kategori Pengeluaran
            </Link>
          </li>
          <li>
            <Link to="/expenses" onClick={onClose} className={menuClass("/expenses")}>
              Pengeluaran
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
