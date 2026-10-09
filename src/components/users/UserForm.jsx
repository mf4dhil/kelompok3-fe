
const inputClass =
  "w-full px-4 py-3 rounded-lg border border-primary/20 bg-white text-primary placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary";
const labelClass = "block text-sm font-medium text-primary mb-2";

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
      <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
        <div>
          <h2 className="text-xl font-bold text-primary">
            {isEdit ? "Edit User" : "Tambah User"}
          </h2>
          <p className="text-sm text-primary/60 mt-1">
            {isEdit ? "Perbarui informasi user" : "Tambahkan user baru"}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-9 h-9 rounded-full flex items-center justify-center text-primary/60 hover:bg-quaternary hover:text-primary transition"
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

          {/* address */}
          <div className="md:col-span-2">
            <label className={labelClass}>address (opsional)</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Masukkan address"
              rows="3"
              className={inputClass}
            />
          </div>
        </div>

        {/* FOOTER BUTTON */}
        <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-primary/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-primary/20 text-primary hover:bg-quaternary transition"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-secondary text-white font-medium hover:bg-primary transition"
          >
            {isEdit ? "Update User" : "Simpan User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;