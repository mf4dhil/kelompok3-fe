import { useState, useEffect } from "react";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
};

// Ambil pesan error dari backend (key "msg")
const getErrorMessage = (error, fallback) =>
  error.response?.data?.msg ||
  (error.response
    ? `${fallback} (status ${error.response.status})`
    : "Backend tidak bisa dihubungi");

function Users() {
  // DATA USER (dari database lewat backend)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // FORM
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // SEARCH & FILTER
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");

  // READ
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
      setErrorMsg("");
    } catch (error) {
      console.log(error.response?.status, error.response?.data);
      setErrorMsg(getErrorMessage(error, "Gagal mengambil data user"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // FILTER USER
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      (user.name || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword);

    const matchRole =
      roleFilter === "Semua" ||
      (user.role || "").toLowerCase() === roleFilter.toLowerCase();

    return matchSearch && matchRole;
  });

  // BUKA FORM TAMBAH
  const handleAddUser = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // BUKA FORM EDIT
  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      password: "",
    });
    setShowForm(true);
  };

  // CREATE & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId !== null) {
        // backend hanya menerima name, email, phone, address
        await updateUser(editId, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        });
        alert("Data user berhasil diupdate");
      } else {
        await createUser(form);
        alert("User berhasil ditambahkan");
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      console.log(error.response?.status, error.response?.data);
      alert(getErrorMessage(error, "Gagal menyimpan data"));
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus user ini?")) return;

    try {
      await deleteUser(id);
      alert("User berhasil dihapus");
      fetchUsers();
    } catch (error) {
      console.log(error.response?.status, error.response?.data);
      alert(getErrorMessage(error, "Gagal menghapus user"));
    }
  };

  // RESET FORM
  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF5EE]">
      <div className="flex-1 min-w-0">
        <main className="p-6">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#2B1B17]">Admin User</h1>
              <p className="text-sm text-[#2B1B17]/60 mt-1">
                Kelola data pengguna sistem CakeOrder
              </p>
            </div>

            <button
              onClick={handleAddUser}
              className="px-5 py-3 rounded-lg bg-[#C86D51] text-white font-medium hover:bg-[#2B1B17] transition"
            >
              + Tambah User
            </button>
          </div>

          {/* PESAN ERROR */}
          {errorMsg && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-[#C86D51]/10 text-[#C86D51] text-sm flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={fetchUsers} className="underline font-medium">
                Coba lagi
              </button>
            </div>
          )}

          {/* TABLE CARD */}
          <div className="bg-white rounded-xl border border-[#2B1B17]/10 shadow-sm">
            {/* SEARCH & FILTER */}
            <div className="p-5 border-b border-[#2B1B17]/10">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#2B1B17]/20 bg-white text-[#2B1B17] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C86D51]"
                />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-[#2B1B17]/20 bg-white text-[#2B1B17] focus:outline-none focus:ring-2 focus:ring-[#C86D51]"
                >
                  <option value="Semua">Semua Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>

            {/* USER TABLE */}
            <UserTable
              users={filteredUsers}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      {/* POPUP TAMBAH / EDIT */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <UserForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              isEdit={editId !== null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;