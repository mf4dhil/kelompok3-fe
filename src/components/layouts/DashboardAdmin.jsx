import React from 'react';
import Sidebar from '../dashboard/Sidebar';
import Navbar from '../dashboard/Navbar';
import { Outlet } from 'react-router-dom';

function DashboardAdmin() {
  return (
    <div className='flex min-h-screen bg-quaternary'>
      {/* Sidebar */}
      <Sidebar />
      {/* Content */}
      <div className='flex-1 min-w-0 '>
        {/* Navbar */}
        <Navbar />
        {/* Main */}
        <main className='p-6'>
          <Outlet />
        </main>
        <footer className='border-t border-primary/10 bg-quaternary py-4 text-center text-sm text-primary/60'>© 2026 CakeOrder - Sistem Pre-Order Kue</footer>
      </div>
    </div>
  );
}

export default DashboardAdmin;