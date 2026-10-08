import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { logout } from '../../utils/auth';

function Navbar({ onToggleSidebar }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      'Apakah kamu yakin ingin logout?'
    );

    if (!confirmLogout) return;

    setIsLoggingOut(true);
    await logout();
  };

  return (
    <header className="sticky top-0 z-20 h-20 bg-primary border-b border-primary/10 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-secondary/20 text-white hover:bg-secondary/30 transition"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
        <span className="font-semibold text-white text-lg lg:hidden">CakeOrder</span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-primary">
            Admin
          </p>
          <p className="text-xs text-primary/60">
            Administrator
          </p>
        </div>

        {/* Tombol Profil/Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-semibold shadow"
          >
            A
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-44 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 sm:hidden">
                <p className="font-semibold text-primary text-sm">Admin</p>
                <p className="text-xs text-primary/60">Administrator</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
