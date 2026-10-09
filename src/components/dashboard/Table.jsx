function OrderTable({ orders }) {
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
      ready: { label: 'Ready', color: 'bg-green-100 text-green-700' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="bg-white rounded-xl border border-[#2B1B17]/10 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-[#2B1B17]/10">
        <h2 className="text-lg font-bold text-[#2B1B17]">
          Pre-Order Terbaru
        </h2>

        <p className="text-sm text-[#2B1B17]/60">
          Daftar pesanan kue terbaru
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5EE]">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                No.
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                No. Order
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Pelanggan
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Tanggal Pickup
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Total
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const statusInfo = getStatusBadge(order.status);
              const customerName = order.Customer?.name || order.customer?.name || '-';
              
              return (
                <tr
                  key={order.id}
                  className="border-t border-[#2B1B17]/10 hover:bg-[#FAF5EE]/70 transition"
                >
                  <td className="px-5 py-4 text-sm font-mono font-bold text-[#2B1B17]">
                    {`${index + 1}.`}
                  </td>
                  <td className="px-5 py-4 text-sm font-mono font-bold text-[#2B1B17]">
                    {order.order_number || `#${index + 1}`}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[#2B1B17]">
                    {customerName}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#2B1B17]/70">
                    {order.pickup_date || '-'}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#2B1B17]">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
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
