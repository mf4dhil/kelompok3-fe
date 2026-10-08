import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { customersService } from '../services/orderService';

export default function Pelanggan() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await customersService.getAll({ search });
      setCustomers(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Pelanggan</h1>
        <p className="text-primary/60 text-sm">Kelola data pelanggan dan lihat daftar customer</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-secondary/20 p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/10 border border-secondary/25 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-primary/50">Memuat data pelanggan...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-primary/50">Belum ada data pelanggan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-quaternary border-b border-secondary/20 text-xs font-semibold text-primary uppercase">
                <tr>
                  <th className="px-6 py-3 w-16">No</th>
                  <th className="px-6 py-3">Nama Pelanggan</th>
                  <th className="px-6 py-3">No. HP</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Alamat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {customers.map((c, i) => (
                  <tr key={c.id} className="hover:bg-quaternary/50 transition">
                    <td className="px-6 py-4 text-primary/70">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-primary">{c.name}</td>
                    <td className="px-6 py-4 text-primary/80">{c.phone || '-'}</td>
                    <td className="px-6 py-4 text-primary/80">{c.email || '-'}</td>
                    <td className="px-6 py-4 text-primary/80">{c.address || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
