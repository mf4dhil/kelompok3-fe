import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/Card";
import OrderTable from "../components/Table";

function Dashboard() {
  // Data dummy
  const orders = [
    {
      id: 1,
      pelanggan: "Andi",
      kue: "Brownies Coklat",
      tanggal: "05-10-2026",
      status: "Diproses"
    },
    {
      id: 2,
      pelanggan: "Siti",
      kue: "Birthday Cake",
      tanggal: "06-10-2026",
      status: "Baru"
    },
    {
      id: 3,
      pelanggan: "Budi",
      kue: "Donat Coklat",
      tanggal: "06-10-2026",
      status: "Selesai"
    },
    {
      id: 4,
      pelanggan: "Rina",
      kue: "Cheese Cake",
      tanggal: "07-10-2026",
      status: "Diproses"
    },
    {
      id: 5,
      pelanggan: "Dewi",
      kue: "Red Velvet",
      tanggal: "07-10-2026",
      status: "Baru"
    }
  ];

    // Menghitung jumlah pesanan
  const totalPesanan = orders.length;

  const pesananBaru = orders.filter(
    order => order.status === "Baru"
  ).length;

  const pesananDiproses = orders.filter(
    order => order.status === "Diproses"
  ).length;

  const pesananSelesai = orders.filter(
    order => order.status === "Selesai"
  ).length;

  return (
    <div className="flex min-h-screen bg-[#FAF5EE]">
      {/* Sidebar */}
      <Sidebar />
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Navbar */}
        <Navbar />
        {/* Main */}
        <main className="p-6">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#2B1B17]">
              Ringkasan Pesanan
            </h2>
            <p className="text-sm text-[#2B1B17]/60">
              Informasi pre-order kue hari ini
            </p>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Pesanan"
              value={totalPesanan}
              description="Total semua pesanan"
              icon="📦"
              iconColor="bg-[#C86D51]/15"
            />
            <StatCard
              title="Pesanan Baru"
              value={pesananBaru}
              description="Menunggu diproses"
              icon="📝"
              iconColor="bg-[#E8A857]/20"
            />
            <StatCard
              title="Diproses"
              value={pesananDiproses}
              description="Sedang dibuat"
              icon="🍰"
              iconColor="bg-[#C86D51]/15"
            />
            <StatCard
              title="Selesai"
              value={pesananSelesai}
              description="Pesanan selesai"
              icon="✓"
              iconColor="bg-[#2B1B17]/10"
            />
          </div>

          {/* Table */}
          <div className="mt-6">
            <OrderTable orders={orders} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#2B1B17]/10 bg-[#FAF5EE] py-4 text-center text-sm text-[#2B1B17]/60">
          © 2026 CakeOrder - Sistem Pre-Order Kue
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;