import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className='w-64 min-h-screen bg-[#2B1B17] text-white'>
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
            <Link to='/dashboard' className={isActive('/dashboard') ? 'block px-4 py-3 rounded-lg bg-[#C86D51] text-white' : 'block px-4 py-3 rounded-lg hover:bg-[#C86D51] transition'}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to='/produk-admin' className={isActive('/produk-admin') ? 'block px-4 py-3 rounded-lg bg-[#C86D51] text-white' : 'block px-4 py-3 rounded-lg hover:bg-[#C86D51] transition'}>
              Produk
            </Link>
          </li>
          <li>
            <Link to='/preorder' className='block px-4 py-3 rounded-lg hover:bg-[#C86D51] transition'>
              Pre-Order
            </Link>
          </li>
          <li>
            <Link to='/pelanggan' className='block px-4 py-3 rounded-lg hover:bg-[#C86D51] transition'>
              Pelanggan
            </Link>
          </li>
          <li>
            <Link to='/laporan' className='block px-4 py-3 rounded-lg hover:bg-[#C86D51] transition'>
              Laporan
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
