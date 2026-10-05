import React, { useState } from 'react';
import NavbarHome from '../components/NavbarHome';
import Footer from '../components/Footer';

export default function Produk() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    { 
      id: 1, 
      name: 'Signature Classic', 
      price: 89000, 
      desc: 'Klasik favorit cita semua', 
      category: 'signature', 
      image: '👑' 
    },
    { 
      id: 2, 
      name: 'Rainbow Fondant', 
      price: 125000, 
      desc: 'Hasil warna pelangi mewah', 
      category: 'signature', 
      image: '🌈' 
    },
    { 
      id: 3, 
      name: 'Kue Apel', 
      price: 65000, 
      desc: 'Pelapis renyah & isi manis', 
      category: 'favorit', 
      image: '🍎' 
    },
    { 
      id: 4, 
      name: 'Oreo Cream', 
      price: 72000, 
      desc: 'Oreo garing & cream lembut', 
      category: 'favorit', 
      image: '🍪' 
    },
    { 
      id: 5, 
      name: 'Chocolate Hazelnut', 
      price: 95000, 
      desc: 'Chocolate & hazelnut premium', 
      category: 'signature', 
      image: '🍫' 
    },
    { 
      id: 6, 
      name: 'Red Velvet', 
      price: 88000, 
      desc: 'Velvet merah & cream cheese', 
      category: 'favorit', 
      image: '🎂' 
    },
    { 
      id: 7, 
      name: 'Matcha Green Tea', 
      price: 92000, 
      desc: 'Matcha premium & white chocolate', 
      category: 'signature', 
      image: '🍵' 
    },
    { 
      id: 8, 
      name: 'Strawberry Shortcake', 
      price: 78000, 
      desc: 'Strawberry segar & whipped cream', 
      category: 'favorit', 
      image: '🍓' 
    },
    { 
      id: 9, 
      name: 'Tiramisu Classic', 
      price: 85000, 
      desc: 'Kopi & mascarpone autentik', 
      category: 'favorit', 
      image: '☕' 
    },
    { 
      id: 10, 
      name: 'Salted Caramel', 
      price: 90000, 
      desc: 'Karamel gurih & sea salt', 
      category: 'signature', 
      image: '🧂' 
    },
  ];

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'signature', label: 'Signature' },
    { value: 'favorit', label: 'Favorit' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-quaternary">
      <NavbarHome />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-3">
            Produk Kue Kami
          </h1>
          <p className="text-primary/70">
            Temukan berbagai pilihan kue premium dengan bahan berkualitas tinggi
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari kue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-secondary/30 rounded-xl px-4 py-3 pl-11 
                focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent 
                text-primary placeholder-primary/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">🔍</span>
          </div>
          
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all 
                  ${selectedCategory === cat.value 
                    ? 'bg-tertiary text-primary shadow-tertiary/30' 
                    : 'bg-white border border-secondary/30 text-primary/70 hover:border-tertiary hover:bg-secondary/10'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                formatPrice={formatPrice} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-semibold text-primary mb-2">Produk tidak ditemukan</h3>
              <p className="text-primary/60">Coba ubah kata kunci atau filter pencarian</p>
            </div>
          )}
        </div>

        {/* Pagination (placeholder) */}
        {filteredProducts.length > 8 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="px-4 py-2 border border-secondary/30 rounded-lg text-primary/70 hover:bg-secondary/10 transition">
              Sebelumnya
            </button>
            <button className="w-10 h-10 bg-tertiary text-primary rounded-lg font-semibold">1</button>
            <button className="w-10 h-10 border border-secondary/30 rounded-lg text-primary/70 hover:bg-secondary/10 transition">2</button>
            <button className="w-10 h-10 border border-secondary/30 rounded-lg text-primary/70 hover:bg-secondary/10 transition">3</button>
            <button className="px-4 py-2 border border-secondary/30 rounded-lg text-primary/70 hover:bg-secondary/10 transition">
              Selanjutnya
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ProductCard({ product, formatPrice }) {
  const isSignature = product.category === 'signature';
  
  return (
    <div className="bg-white rounded-2xl border border-secondary/20 overflow-hidden hover:border-tertiary/40 hover:shadow-lg hover:shadow-tertiary/10 transition-all duration-300 flex flex-col">
      {/* Image/Icon */}
      <div className="h-48 relative bg-gradient-to-br from-secondary/10 to-tertiary/10 flex items-center justify-center">
        <span className="text-6xl">{product.image}</span>
        {isSignature && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-tertiary text-primary text-xs font-bold rounded-full">
            Signature
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-primary/70 mb-4 line-clamp-2 flex-1">
          {product.desc}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
          <span className="text-xl font-bold text-tertiary">
            {formatPrice(product.price)}
          </span>
          <button className="px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary text-sm font-semibold rounded-lg transition">
            Pesan
          </button>
        </div>
      </div>
    </div>
  );
}

