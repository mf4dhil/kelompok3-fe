function OrderTable({ orders }) {

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
        <table className="w-full">
          <thead className="bg-[#FAF5EE]">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                No
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Pelanggan
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Kue
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Tanggal
              </th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-[#2B1B17]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className="border-t border-[#2B1B17]/10 hover:bg-[#FAF5EE]/70"
              >
                <td className="px-5 py-4 text-sm text-[#2B1B17]">
                  {index + 1}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[#2B1B17]">
                  {order.pelanggan}
                </td>
                <td className="px-5 py-4 text-sm text-[#2B1B17]/70">
                  {order.kue}
                </td>
                <td className="px-5 py-4 text-sm text-[#2B1B17]/70">
                  {order.tanggal}
                </td>
                <td className="px-5 py-4">
                  {order.status === "Baru" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E8A857]/20 text-[#2B1B17]">
                      Baru
                    </span>
                  )}
                  {order.status === "Diproses" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#C86D51]/20 text-[#C86D51]">
                      Diproses
                    </span>
                  )}
                  {order.status === "Selesai" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#2B1B17]/10 text-[#2B1B17]">
                      Selesai
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;