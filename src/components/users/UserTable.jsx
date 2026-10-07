// function UserTable({ users, onEdit, onDelete }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b border-[#2B1B17]/10 text-left">
//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               No
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               Nama
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               Email
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               Phone
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               Role
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17] text-center">
//               Aksi
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.length > 0 ? (
//             users.map((user, index) => (
//               <tr
//                 key={user.id}
//                 className="border-b border-[#2B1B17]/10 hover:bg-[#FAF5EE] transition text-[#2B1B17]"
//               >
//                 <td className="px-4 py-4 text-sm">{index + 1}</td>

//                 <td className="px-4 py-4 text-sm font-medium">{user.nama}</td>

//                 {/* username di frontend = email di database */}
//                 <td className="px-4 py-4 text-sm">{user.username}</td>

//                 <td className="px-4 py-4 text-sm">{user.phone || "-"}</td>

//                 <td className="px-4 py-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       user.role === "Admin"
//                         ? "bg-[#2B1B17]/10 text-[#2B1B17]"
//                         : user.role === "Kasir"
//                         ? "bg-[#C86D51]/20 text-[#C86D51]"
//                         : "bg-[#E8A857]/20 text-[#2B1B17]"
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>

//                 <td className="px-4 py-4">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => onEdit(user)}
//                       className="px-3 py-2 rounded-lg bg-[#E8A857]/20 text-[#2B1B17] text-sm hover:bg-[#E8A857] transition"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => onDelete(user.id)}
//                       className="px-3 py-2 rounded-lg bg-[#C86D51]/20 text-[#C86D51] text-sm hover:bg-[#C86D51] hover:text-white transition"
//                     >
//                       Hapus
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan="6"
//                 className="px-4 py-8 text-center text-[#2B1B17]/50"
//               >
//                 Data user tidak ditemukan.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UserTable;



// function UserTable({ users, onEdit, onDelete }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b border-[#2B1B17]/10 text-left">
//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               No
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               Nama
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               Username
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17]">
//               Role
//             </th>

//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17] text-center">
//               Email
//             </th>
//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17] text-center">
//               Phone
//             </th>
//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17] text-center">
//               Password
//             </th>
//             <th className="px-4 py-4 text-sm font-semibold text-[#2B1B17] text-center">
//               Aksi
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.length > 0 ? (
//             users.map((user, index) => (
//               <tr
//                 key={user.id}
//                 className="border-b border-[#2B1B17]/10 hover:bg-[#FAF5EE] transition text-[#2B1B17]"
//               >
//                 <td className="px-4 py-4 text-sm">
//                   {index + 1}
//                 </td>

//                 <td className="px-4 py-4 text-sm font-medium">
//                   {user.nama}
//                 </td>

//                 <td className="px-4 py-4 text-sm">
//                   {user.username}
//                 </td>

//                 <td className="px-4 py-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       user.role === "Admin"
//                         ? "bg-[#2B1B17]/10 text-[#2B1B17]"
//                         : user.role === "Kasir"
//                         ? "bg-[#C86D51]/20 text-[#C86D51]"
//                         : "bg-[#E8A857]/20 text-[#2B1B17]"
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>

//                 <td className="px-4 py-4">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => onEdit(user)}
//                       className="px-3 py-2 rounded-lg bg-[#E8A857]/20 text-[#2B1B17] text-sm hover:bg-[#E8A857] transition"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => onDelete(user.id)}
//                       className="px-3 py-2 rounded-lg bg-[#C86D51]/20 text-[#C86D51] text-sm hover:bg-[#C86D51] hover:text-white transition"
//                     >
//                       Hapus
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan="5"
//                 className="px-4 py-8 text-center text-[#2B1B17]/50"
//               >
//                 Data user tidak ditemukan.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UserTable;



const roleStyle = (role) => {
  const r = (role || "").toLowerCase();
  if (r === "admin") return "bg-[#2B1B17]/10 text-[#2B1B17]";
  if (r === "kasir") return "bg-[#C86D51]/20 text-[#C86D51]";
  return "bg-[#E8A857]/20 text-[#2B1B17]";
};

// "admin" -> "Admin"
const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "-";

const thClass = "px-4 py-4 text-sm font-semibold text-[#2B1B17]";

function UserTable({ users, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2B1B17]/10 text-left">
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
              <td colSpan="7" className="px-4 py-8 text-center text-[#2B1B17]/50">
                Memuat data...
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-[#2B1B17]/10 hover:bg-[#FAF5EE] transition text-[#2B1B17]"
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
                      className="px-3 py-2 rounded-lg bg-[#E8A857]/20 text-[#2B1B17] text-sm hover:bg-[#E8A857] transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(user.id)}
                      className="px-3 py-2 rounded-lg bg-[#C86D51]/20 text-[#C86D51] text-sm hover:bg-[#C86D51] hover:text-white transition"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-[#2B1B17]/50">
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