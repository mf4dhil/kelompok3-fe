function OrderTable({ orders }) {
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Terkonfirmasi', color: 'bg-teal-100 text-teal-700' },
      processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
      ready: { label: 'Siap diambil', color: 'bg-green-100 text-green-700' },
      completed: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);

  const formatDate = (date) => date
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
    : '-';

  const getPaymentStatus = (status) => ({
    unpaid: { label: 'Belum bayar', color: 'bg-red-100 text-red-700' },
    partial: { label: 'Sebagian', color: 'bg-amber-100 text-amber-700' },
    paid: { label: 'Lunas', color: 'bg-green-100 text-green-700' },
  }[status] || { label: 'Belum bayar', color: 'bg-red-100 text-red-700' });

  return (
    <div className="bg-white rounded-xl border border-primary/10 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-primary/10">
        <h2 className="text-lg font-bold text-primary">
          Pre-Order Terbaru
        </h2>

        <p className="text-sm text-primary/60">
          10 pesanan terakhir yang masuk
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-quaternary">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">No</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">No. Order</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">Pelanggan</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">Tanggal Order</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">Tanggal Pickup</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">Total</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">Status Order</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary">Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const statusInfo = getStatusBadge(order.status);
              const paymentStatus = getPaymentStatus(order.payment_status);
              const customerName = order.Customer?.name || order.customer?.name || '-';
              
              return (
                <tr
                  key={order.id}
                  className="border-t border-primary/10 hover:bg-quaternary/70 transition"
                >
                  <td className="px-5 py-4 text-sm font-mono font-bold text-primary">
                    {index + 1}
                  </td>
                  <td className="px-5 py-4 text-sm font-mono font-bold text-primary">
                    {order.order_number || `#${index + 1}`}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-primary">
                    {customerName}
                  </td>
                  <td className="px-5 py-4 text-sm text-primary/70">
                    {formatDate(order.created_at || order.order_date)}
                  </td>
                  <td className="px-5 py-4 text-sm text-primary/70">
                    {formatDate(order.pickup_date)}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStatus.color}`}>
                      {paymentStatus.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;
