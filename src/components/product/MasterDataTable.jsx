import { useEffect, useState } from "react";

export default function MasterDataTable({
  title,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  field = "name",
}) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    String(item[field] || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="master-data-container">

      {/* HEADER */}
      <div className="master-data-header">
        <div>
          <h2>{title}</h2>
          <p>Kelola data {title.toLowerCase()}</p>
        </div>

        <button
          className="btn-add"
          onClick={onAdd}
        >
          + Tambah {title}
        </button>
      </div>

      {/* SEARCH */}
      <div className="master-data-search">
        <input
          type="text"
          placeholder={`Cari ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="master-data-table-wrapper">

        {loading ? (
          <div className="loading">
            Memuat data...
          </div>
        ) : (
          <table className="master-data-table">

            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center" }}
                  >
                    Belum ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {item[field]}
                    </td>

                    <td>

                      <button
                        className="btn-edit"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => onDelete(item)}
                      >
                        Hapus
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}