
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'nifacake-cart';

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);

  // Simpan keranjang setiap kali isinya berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Tambahkan produk ke keranjang
  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        return currentItems.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Ubah jumlah produk
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Hapus satu produk
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => String(item.id) !== String(productId)
      )
    );
  };

  // Kosongkan seluruh keranjang
  const clearCart = () => {
    setCartItems([]);
  };

  // Total kuantitas seluruh produk
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total harga seluruh produk
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }

  return context;
}