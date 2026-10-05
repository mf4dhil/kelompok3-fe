import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" role="img" aria-label="cake">🍰</span>
              <span className="font-bold text-xl tracking-tight text-quaternary">SweetCake</span>
            </div>
            <p className="text-quaternary/70 text-sm leading-relaxed">
              Homemade cake untuk momen spesialmu. Dibuat fresh setiap pesanan dengan bahan berkualitas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-quaternary mb-4">Menu Cepat</h4>
            <ul className="space-y-2 text-xs text-quaternary/70">
              <li><a href="#home" className="hover:text-tertiary transition">Home</a></li>
              <li><a href="#menu" className="hover:text-tertiary transition">Menu Kue</a></li>
              <li><a href="#cara-po" className="hover:text-tertiary transition">Cara PO</a></li>
              <li><a href="#tentang" className="hover:text-tertiary transition">Tentang Kami</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-quaternary mb-4">Kontak</h4>
            <ul className="space-y-2 text-xs text-quaternary/70">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Jl. Kue Lezat No. 123, Jakarta</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>hello@sweetcake.id</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🕒</span>
                <span>Senin - Sabtu, 09:00 - 18:00</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-quaternary mb-4">Ikuti Kami</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-quaternary/70 hover:text-tertiary transition" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="text-quaternary/70 hover:text-tertiary transition" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.548.655a.354.354 0 0 0-.24-.048c-.092 0-.181.034-.248.101l-2.046 2.046-1.825-1.825a.353.353 0 0 0-.5.002l-2.58 2.58a.353.353 0 0 0 0 .5l4.49 4.49a.353.353 0 0 0 .5 0l2.58-2.58a.353.353 0 0 0 0-.5l-4.49-4.49a.353.353 0 0 0-.5 0l-1.825 1.825 2.046 2.046c.067.067.156.101.248.101.092 0 .18-.034.248-.101l4.49-4.49a.353.353 0 0 0 0-.5l-4.49-4.49a.353.353 0 0 0-.5 0l-2.58 2.58a.353.353 0 0 0 0 .5l1.825 1.825-2.046 2.046c.067.067.156.101.248.101l-4.49-4.49a.353.353 0 0 0 0-.5l2.58-2.58a.353.353 0 0 0 0-.5l-1.825-1.825 2.046-2.046zM12.548 2.115l4.49 4.49a.353.353 0 0 1 0 .5l-2.58 2.58a.353.353 0 0 1-.5 0l-4.49-4.49a.353.353 0 0 1 0-.5l2.58-2.58a.353.353 0 0 1 .5 0zm-4.49 4.49l4.49 4.49a.353.353 0 0 1 0 .5l-2.58 2.58a.353.353 0 0 1-.5 0l-4.49-4.49a.353.353 0 0 1 0-.5l2.58-2.58a.353.353 0 0 1 .5 0zm-4.49 4.49l4.49 4.49a.353.353 0 0 1 0 .5l-2.58 2.58a.353.353 0 0 1-.5 0l-4.49-4.49a.353.353 0 0 1 0-.5l2.58-2.58a.353.353 0 0 1 .5 0zm-4.49 4.49l4.49 4.49a.353.353 0 0 1 0 .5l-2.58 2.58a.353.353 0 0 1-.5 0l-4.49-4.49a.353.353 0 0 1 0-.5l2.58-2.58a.353.353 0 0 1 .5 0z"/></svg>
              </a>
              <a href="#" className="text-quaternary/70 hover:text-tertiary transition" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.84 11.84 0 0 0 12 0C5.37 0 0 5.37 0 12c0 1.87.53 3.64 1.46 5.17L0 24l6.17-1.73a11.84 11.84 0 0 0 5.17 1.46c6.63 0 12-5.37 12-12 0-1.53-.23-3-.67-4.39a11.78 11.78 0 0 0-1.95-2.78c-.53-.53-1.06-.98-1.7-1.35-.21-.14-.42-.28-.64-.41-.06-.04-.11-.09-.17-.13-.04-.03-.08-.06-.12-.1-.03-.02-.06-.04-.09-.07-.02-.01-.04-.02-.06-.04-.02-.02-.03-.04-.05-.06a1.5 1.5 0 0 1-.17-.3c-.03-.06-.06-.12-.08-.19-.02-.06-.03-.12-.04-.18-.01-.06-.02-.12-.03-.18-.01-.06-.02-.11-.03-.17-.01-.05-.01-.1-.02-.15 0-.05-.01-.1-.02-.15-.01-.05-.02-.1-.03-.15-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a1.5 1.5 0 0 0-.08-.38c-.02-.06-.03-.11-.04-.17-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a2.3 2.3 0 0 0-.08-.4c-.02-.05-.03-.1-.04-.15-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a1.5 1.5 0 0 0-.08-.38c-.02-.06-.03-.11-.04-.17-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a2.3 2.3 0 0 0-.08-.4c-.02-.05-.03-.1-.04-.15-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a1.5 1.5 0 0 0-.08-.38c-.02-.06-.03-.11-.04-.17-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a2.3 2.3 0 0 0-.08-.4c-.02-.05-.03-.1-.04-.15-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a1.5 1.5 0 0 0-.08-.38c-.02-.06-.03-.11-.04-.17-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a2.3 2.3 0 0 0-.08-.4c-.02-.05-.03-.1-.04-.15-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a1.5 1.5 0 0 0-.08-.38c-.02-.06-.03-.11-.04-.17-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a2.3 2.3 0 0 0-.08-.4c-.02-.05-.03-.1-.04-.15-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a1.5 1.5 0 0 0-.08-.38c-.02-.06-.03-.11-.04-.17-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15a2.3 2.3 0 0 0-.08-.4c-.02-.05-.03-.1-.04-.15-.01-.05-.02-.1-.02-.15 0-.05-.01-.1-.01-.15z"/></svg>
              </a>
            </div>
            <p className="text-xs text-quaternary/50">
              © {currentYear} SweetCake. Semua hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}