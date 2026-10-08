import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Navbar from '../dashboard/Navbar';
import { Outlet } from 'react-router-dom';

function DashboardAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen bg-quaternary'>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Content */}
      <div className='flex-1 min-w-0 lg:ml-64 flex flex-col min-h-screen'>
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {/* Main */}
        <main className='p-4 sm:p-6 flex-1'>
          <Outlet />
        </main>
        <footer className='border-t border-primary/10 bg-quaternary py-4 text-center text-xs sm:text-sm text-primary/60'>
          © 2026 CakeOrder - Sistem Pre-Order Kue
        </footer>
      </div>
    </div>
  );
}

export default DashboardAdmin;
