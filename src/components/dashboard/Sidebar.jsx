import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuClass = (path) => {
    if (location.pathname === path) {
      return "block px-4 py-3 rounded-lg bg-[#C86D51] text-white";
    }

    return "block px-4 py-3 rounded-lg hover:bg-[#C86D51] transition";
  };

  return (    <aside className='fixed top-0 left-0 h-screen w-64 overflow-y-auto bg-[#2B1B17] text-white'>
      {/* Logo */}
      <div className='h-20 flex items-center justify-center border-b border-white/10'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>CakeOrder</h1>
          <p className='text-xs text-[#FAF5EE]/70'>Pre-Order Kue</p>
        </div>
      </div>

      {/* Menu */}
      <div className='p-4'>
        <p className='text-xs text-[#FAF5EE]/50 mb-3'>MENU UTAMA</p>
        <ul className='space-y-2'>
          <li>
            <Link
              to="/dashboard"
              className={menuClass("/dashboard")}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/users"
              className={menuClass("/users")}
            >
              User
            </Link>
          </li>

          <li>
            <Link
              to="/produk-admin"
              className={menuClass("/produk-admin")}
            >
              Produk Kue
            </Link>
          </li>

          <li>
            <Link
              to="/master-data"
              className={menuClass("/master-data")}
            >
              Master Data
            </Link>
          </li>

          <li>
            <Link
              to="/preorder"
              className={menuClass("/preorder")}
            >
              Pre-Order
            </Link>
          </li>

          <li>
            <Link
              to="/pelanggan"
              className={menuClass("/pelanggan")}
            >
              Pelanggan
            </Link>
          </li>

          <li>
            <Link
              to="/laporan"
              className={menuClass("/laporan")}
            >
              Laporan
            </Link>
          </li>
        </ul>

        {/* Inventory Section */}
        <p className='text-xs text-[#FAF5EE]/50 mt-4 mb-2'>INVENTORY</p>
        <ul className='space-y-2'>
          <li>
            <Link to="/materials" className={menuClass("/materials")}>
              Bahan Baku
            </Link>
          </li>
          <li>
            <Link to="/materials/low-stock" className={menuClass("/materials/low-stock")}>
              Stok Rendah
            </Link>
          </li>
          <li>
            <Link to="/material-purchases" className={menuClass("/material-purchases")}>
              Pembelian Bahan
            </Link>
          </li>
        </ul>

        {/* Finance Section */}
        <p className='text-xs text-[#FAF5EE]/50 mt-4 mb-2'>KEUANGAN</p>
        <ul className='space-y-2'>
          <li>
            <Link to="/expense-categories" className={menuClass("/expense-categories")}>
              Kategori Pengeluaran
            </Link>
          </li>
          <li>
            <Link to="/expenses" className={menuClass("/expenses")}>
              Pengeluaran
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;