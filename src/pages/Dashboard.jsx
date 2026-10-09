import React, { useEffect, useState } from 'react';
import { ordersService } from '../services/orderService';
import StatCard from '../components/dashboard/Card';
import OrderTable from '../components/dashboard/Table';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersService.getAll();
      // Handle pagination or array response
      const list = Array.isArray(res) ? res : res.data || res.orders || [];
      setOrders(list);
    } catch (err) {
      console.error('Gagal mengambil order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hitung statistik dari data orders
  const totalPesanan = orders.length;
  const pesananBaru = orders.filter((order) => order.status === 'pending').length;
  const pesananDiproses = orders.filter((order) => order.status === 'processing').length;
  const pesananSelesai = orders.filter((order) => order.status === 'completed').length;

  return (
    <>
      {/* Heading */}
      <div className='mb-6'>
        <h2 className='text-xl font-bold text-primary'>Ringkasan Pesanan</h2>
        <p className='text-sm text-primary/60'>Informasi pre-order kue hari ini</p>
      </div>

      {/* Statistik */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        <StatCard
          title='Total Pesanan'
          value={totalPesanan}
          description='Total semua pesanan'
          icon='📦'
          iconColor='bg-secondary/15'
        />
        <StatCard
          title='Pesanan Baru'
          value={pesananBaru}
          description='Menunggu diproses'
          icon='📝'
          iconColor='bg-tertiary/20'
        />
        <StatCard
          title='Diproses'
          value={pesananDiproses}
          description='Sedang dibuat'
          icon='🍰'
          iconColor='bg-secondary/15'
        />
        <StatCard
          title='Selesai'
          value={pesananSelesai}
          description='Pesanan selesai'
          icon='✓'
          iconColor='bg-primary/10'
        />
      </div>

      {/* Table */}
      <div className='mt-6'>
        {loading ? (
          <p className='text-primary/50'>Memuat data order...</p>
        ) : orders.length === 0 ? (
          <p className='text-primary/50'>Belum ada order.</p>
        ) : (
          <OrderTable orders={orders} />
        )}
      </div>
    </>
  );
}

export default Dashboard;