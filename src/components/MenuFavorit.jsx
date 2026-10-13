// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import ProductCard from './menu/ProductCard';
// import { getCustomerProductList } from '../services/productService';

// export default function MenuFavorit() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const list = await getCustomerProductList();
//         setItems(list.slice(0, 6));
//       } catch {
//         setError('Menu belum bisa dimuat. Coba lagi nanti.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <section id="menu" className="py-16 md:py-24 border-b border-secondary/30">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-12 tracking-tight">
//           Menu Kue Favorit
//         </h2>

//         {loading && <p className="text-center text-primary/70">Memuat menu...</p>}
//         {error && <p className="text-center text-primary/70">{error}</p>}

//         {!loading && !error && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {items.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}

//         <div className="mt-10 text-center">
//           <Link
//             to="/produk"
//             className="inline-block px-6 py-3 text-sm font-semibold rounded-lg border border-secondary text-secondary hover:bg-secondary hover:text-quaternary transition"
//           >
//             Lihat Semua Menu
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }


// import React from 'react';

// export default function MenuFavorit() {
//   const menuItems = [
//     { name: 'Signature Classic', price: 'Rp 89.000', desc: 'Klasik favorit cita semua', type: 'signature' },
//     { name: 'Rainbow Fondant', price: 'Rp 125.000', desc: 'Hasil warna pelangi mewah', type: 'signature' },
//     { name: 'Kue Apel', price: 'Rp 65.000', desc: 'Pelapis renyah & isi manis', type: 'favorit' },
//     { name: 'Oreo Cream', price: 'Rp 72.000', desc: 'Oreo garing & cream lembut', type: 'favorit' },
//     { name: 'Chocolate Hazelnut', price: 'Rp 95.000', desc: 'Chocolate & hazelnut premium', type: 'signature' },
//     { name: 'Red Velvet', price: 'Rp 88.000', desc: 'Velvet merah & cream cheese', type: 'favorit' },
//   ];

//   return (
//     <section id="menu" className="py-16 md:py-24 border-b border-secondary/30">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-12 tracking-tight">
//           Menu Kue Favorit
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
//           {menuItems.map((item) => (
//             <div
//               key={item.name}
//               className="bg-secondary/10 border border-secondary/30 rounded-xl overflow-hidden hover:border-tertiary/50 transition transform hover:scale-105 duration-300 flex flex-col justify-between"
//             >
//               <div>
//                 <div className="h-40 bg-secondary/20 flex items-center justify-center">
//                   <span className="text-4xl">{item.type === 'signature' ? '👑' : '🍰'}</span>
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-primary mb-1">{item.name}</h3>
//                   <p className="text-sm text-primary/70 line-clamp-2">{item.desc}</p>
//                 </div>
//               </div>
//               <div className="p-4 border-t border-secondary/30 flex items-center justify-between">
//                 <span className="text-lg font-bold text-tertiary">{item.price}</span>
//                 <span className="text-xs font-semibold px-2 py-1 bg-tertiary/20 text-tertiary rounded">Detail</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
// }



import { useEffect, useState } from "react";
import { getCustomerProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../utils/productImage";

export default function MenuFavorit() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getCustomerProducts();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
        setError("Menu kue gagal dimuat.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <section
      id="menu"
      className="scroll-mt-20 py-16 md:py-24 border-b border-secondary/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-12 tracking-tight">
          Menu Kue Favorit
        </h2>

        {loading && (
          <p className="text-center text-primary/70">
            Memuat menu kue...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && menuItems.length === 0 && (
          <p className="text-center text-primary/70">
            Belum ada menu kue yang tersedia.
          </p>
        )}

        {!loading && !error && menuItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => {
              const prices = (item.productvariants || [])
                .map((variant) => Number(variant.price))
                .filter(
                  (price) => Number.isFinite(price) && price > 0
                );

              const minimumPrice = prices.length
                ? Math.min(...prices)
                : null;
              const maximumPrice = prices.length ? Math.max(...prices) : null;

              return (
                <div
                  key={item.id}
                  className="bg-secondary/10 border border-secondary/30 rounded-xl overflow-hidden hover:border-tertiary/50 transition transform hover:scale-105 duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-secondary/20 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={getProductImageUrl(item.image)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(event) => { event.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <span className="text-4xl">🍰</span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-primary mb-1">
                        {item.name}
                      </h3>

                      <p className="text-sm text-primary/70 line-clamp-2">
                        {item.description || "Pilih varian kue yang sesuai untuk momen spesialmu."}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-secondary/30 flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base font-bold text-tertiary">
                      {minimumPrice !== null
                        ? minimumPrice === maximumPrice
                          ? formatPrice(minimumPrice)
                          : `${formatPrice(minimumPrice)} – ${formatPrice(maximumPrice)}`
                        : "Harga belum tersedia"}
                    </span>

                   <button
                    type="button"
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="text-xs font-semibold px-3 py-2 bg-tertiary/20 text-tertiary rounded hover:bg-tertiary hover:text-white transition"
                  >
                    Detail
                  </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
