import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { logout } from '../../utils/auth';


function Navbar() {
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
    <header className="sticky top-0 z-10 h-20 bg-primary border-b border-primary/10 flex items-center justify-end px-6">
      <div className="flex items-center gap-3">

        <div className="text-right">
          <p className="font-semibold text-primary">
            Admin
          </p>

          <p className="text-xs text-primary/60">
            Administrator
          </p>
        </div>

        {/* Tombol A */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-semibold"
          >
            A
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;