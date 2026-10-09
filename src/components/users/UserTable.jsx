
const roleStyle = (role) => {
  const r = (role || "").toLowerCase();
  if (r === "admin") return "bg-primary/10 text-primary";
  if (r === "kasir") return "bg-secondary/20 text-secondary";
  return "bg-tertiary/20 text-primary";
};

// "admin" -> "Admin"
const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "-";

const thClass = "px-4 py-4 text-sm font-semibold text-primary";

function UserTable({ users, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary/10 text-left">
            <th className={thClass}>No</th>
            <th className={thClass}>Nama</th>
            <th className={thClass}>Email</th>
            <th className={thClass}>Phone</th>
            <th className={thClass}>address</th>
            <th className={thClass}>Role</th>
            <th className={`${thClass} text-center`}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-primary/50">
                Memuat data...
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-primary/10 hover:bg-quaternary transition text-primary"
              >
                <td className="px-4 py-4 text-sm">{index + 1}</td>
                <td className="px-4 py-4 text-sm font-medium">{user.name}</td>
                <td className="px-4 py-4 text-sm">{user.email}</td>
                <td className="px-4 py-4 text-sm">{user.phone || "-"}</td>
                <td className="px-4 py-4 text-sm">{user.address || "-"}</td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyle(
                      user.role
                    )}`}
                  >
                    {formatRole(user.role)}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="px-3 py-2 rounded-lg bg-tertiary/20 text-primary text-sm hover:bg-tertiary transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(user.id)}
                      className="px-3 py-2 rounded-lg bg-secondary/20 text-secondary text-sm hover:bg-secondary hover:text-white transition"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-primary/50">
                Data user tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;