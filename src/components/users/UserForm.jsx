// const inputClass =
//   "w-full px-4 py-3 rounded-lg border border-[#2B1B17]/20 bg-white text-[#2B1B17] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C86D51]";
// const labelClass = "block text-sm font-medium text-[#2B1B17] mb-2";

// function UserForm({ form, setForm, onSubmit, onCancel, isEdit }) {
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl">
//       {/* HEADER POPUP */}
//       <div className="flex items-center justify-between px-6 py-5 border-b border-[#2B1B17]/10">
//         <div>
//           <h2 className="text-xl font-bold text-[#2B1B17]">
//             {isEdit ? "Edit User" : "Tambah User"}
//           </h2>

//           <p className="text-sm text-[#2B1B17]/60 mt-1">
//             {isEdit ? "Perbarui informasi user" : "Tambahkan user baru"}
//           </p>
//         </div>

//         {/* Tombol X */}
//         <button
//           type="button"
//           onClick={onCancel}
//           className="w-9 h-9 rounded-full flex items-center justify-center text-[#2B1B17]/60 hover:bg-[#FAF5EE] hover:text-[#2B1B17] transition"
//         >
//           ✕
//         </button>
//       </div>

//       {/* FORM */}
//       <form onSubmit={onSubmit} className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Nama */}
//           <div>
//             <label className={labelClass}>Nama</label>
//             <input
//               type="text"
//               name="nama"
//               value={form.nama}
//               onChange={handleChange}
//               placeholder="Masukkan nama"
//               required
//               className={inputClass}
//             />
//           </div>

//           {/* Email (name tetap "username" agar cocok dengan Users.jsx) */}
//           <div>
//             <label className={labelClass}>Email</label>
//             <input
//               type="email"
//               name="username"
//               value={form.username}
//               onChange={handleChange}
//               placeholder="Masukkan email"
//               required
//               className={inputClass}
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className={labelClass}>Phone (opsional)</label>
//             <input
//               type="text"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               placeholder="Masukkan nomor telepon"
//               className={inputClass}
//             />
//           </div>

//           {/* Password */}
//           {!isEdit && (
//             <div>
//               <label className={labelClass}>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Masukkan password"
//                 required
//                 className={inputClass}
//               />
//             </div>
//           )}

//           {/* Role */}
//           <div>
//             <label className={labelClass}>Role</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className={inputClass}
//             >
//               <option value="Admin">Admin</option>
//               <option value="Kasir">Kasir</option>
//               <option value="Owner">Owner</option>
//             </select>
//           </div>
//         </div>

//         {/* FOOTER BUTTON */}
//         <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-[#2B1B17]/10">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-5 py-2.5 rounded-lg border border-[#2B1B17]/20 text-[#2B1B17] hover:bg-[#FAF5EE] transition"
//           >
//             Batal
//           </button>

//           <button
//             type="submit"
//             className="px-5 py-2.5 rounded-lg bg-[#C86D51] text-white font-medium hover:bg-[#2B1B17] transition"
//           >
//             {isEdit ? "Update User" : "Simpan User"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default UserForm;



// function UserForm({
//   form,
//   setForm,
//   onSubmit,
//   onCancel,
//   isEdit,
// }) {
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl">

//       {/* HEADER POPUP */}
//       <div className="flex items-center justify-between px-6 py-5 border-b border-[#2B1B17]/10">

//         <div>
//           <h2 className="text-xl font-bold text-[#2B1B17]">
//             {isEdit ? "Edit User" : "Tambah User"}
//           </h2>

//           <p className="text-sm text-[#2B1B17]/60 mt-1">
//             {isEdit
//               ? "Perbarui informasi user"
//               : "Tambahkan user baru"}
//           </p>
//         </div>

//         {/* Tombol X */}
//         <button
//           type="button"
//           onClick={onCancel}
//           className="w-9 h-9 rounded-full
//           flex items-center justify-center
//           text-[#2B1B17]/60
//           hover:bg-[#FAF5EE]
//           hover:text-[#2B1B17]
//           transition"
//         >
//           ✕
//         </button>

//       </div>

//       {/* FORM */}
//       <form onSubmit={onSubmit} className="p-6">

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//           {/* Nama */}
//           <div>
//             <label className="block text-sm font-medium text-[#2B1B17] mb-2">
//               Nama
//             </label>

//             <input
//               type="text"
//               name="nama"
//               value={form.nama}
//               onChange={handleChange}
//               placeholder="Masukkan nama"
//               required
//               className="w-full px-4 py-3
//               rounded-lg
//               border border-[#2B1B17]/20
//               bg-white
//               text-[#2B1B17]
//               placeholder:text-gray-500
//               focus:outline-none
//               focus:ring-2
//               focus:ring-[#C86D51]"
//             />
//           </div>

//           {/* Username */}
//           <div>
//             <label className="block text-sm font-medium text-[#2B1B17] mb-2">
//               Username
//             </label>

//             <input
//               type="email"
//               name="username"
//               value={form.username}
//               onChange={handleChange}
//               placeholder="Masukkan email"
//               required
//               className="w-full px-4 py-3
//               rounded-lg
//               border border-[#2B1B17]/20
//               bg-white
//               text-[#2B1B17]
//               placeholder:text-gray-500
//               focus:outline-none
//               focus:ring-2
//               focus:ring-[#C86D51]"
//             />
//           </div>

//           {/* Password */}
//           {!isEdit && (
//             <div>
//               <label className="block text-sm font-medium text-[#2B1B17] mb-2">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Masukkan password"
//                 required
//                 className="w-full px-4 py-3
//                 rounded-lg
//                 border border-[#2B1B17]/20
//                 bg-white
//                 text-[#2B1B17]
//                 placeholder:text-gray-500
//                 focus:outline-none
//                 focus:ring-2
//                 focus:ring-[#C86D51]"
//               />
//             </div>
//           )}

//           {/* Role */}
//           <div>
//             <label className="block text-sm font-medium text-[#2B1B17] mb-2">
//               Role
//             </label>

//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full px-4 py-3
//               rounded-lg
//               border border-[#2B1B17]/20
//               bg-white
//               text-[#2B1B17]
//               focus:outline-none
//               focus:ring-2
//               focus:ring-[#C86D51]"
//             >
//               <option value="Admin">Admin</option>
//               <option value="Kasir">Kasir</option>
//               <option value="Owner">Owner</option>
//             </select>
//           </div>

//         </div>

//         {/* FOOTER BUTTON */}

//         <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-[#2B1B17]/10">

//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-5 py-2.5 rounded-lg
//             border border-[#2B1B17]/20
//             text-[#2B1B17]
//             hover:bg-[#FAF5EE]
//             transition"
//           >
//             Batal
//           </button>

//           <button
//             type="submit"
//             className="px-5 py-2.5 rounded-lg
//             bg-[#C86D51]
//             text-white
//             font-medium
//             hover:bg-[#2B1B17]
//             transition"
//           >
//             {isEdit ? "Update User" : "Simpan User"}
//           </button>

//         </div>

//       </form>

//     </div>
//   );
// }

// export default UserForm;


const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#2B1B17]/20 bg-white text-[#2B1B17] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C86D51]";
const labelClass = "block text-sm font-medium text-[#2B1B17] mb-2";

function UserForm({ form, setForm, onSubmit, onCancel, isEdit }) {
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl">
      {/* HEADER POPUP */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#2B1B17]/10">
        <div>
          <h2 className="text-xl font-bold text-[#2B1B17]">
            {isEdit ? "Edit User" : "Tambah User"}
          </h2>
          <p className="text-sm text-[#2B1B17]/60 mt-1">
            {isEdit ? "Perbarui informasi user" : "Tambahkan user baru"}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#2B1B17]/60 hover:bg-[#FAF5EE] hover:text-[#2B1B17] transition"
        >
          ✕
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={onSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nama */}
          <div>
            <label className={labelClass}>Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama"
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone (opsional)</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Masukkan nomor telepon"
              className={inputClass}
            />
          </div>

          {/* Password (hanya saat tambah user) */}
          {!isEdit && (
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
                className={inputClass}
              />
            </div>
          )}

          {/* Alamat */}
          <div className="md:col-span-2">
            <label className={labelClass}>Alamat (opsional)</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Masukkan alamat"
              rows="3"
              className={inputClass}
            />
          </div>
        </div>

        {/* FOOTER BUTTON */}
        <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-[#2B1B17]/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-[#2B1B17]/20 text-[#2B1B17] hover:bg-[#FAF5EE] transition"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#C86D51] text-white font-medium hover:bg-[#2B1B17] transition"
          >
            {isEdit ? "Update User" : "Simpan User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;