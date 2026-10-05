import React, { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-secondary/30 bg-primary/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="cake">🍰</span>
            <span className="font-bold text-xl tracking-tight text-quaternary">SweetCake</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-quaternary/80">
            <a href="#home" className="hover:text-tertiary transition-colors">Home</a>
            <a href="#menu" className="hover:text-tertiary transition-colors">Menu</a>
            <a href="#cara-po" className="hover:text-tertiary transition-colors">Cara PO</a>
            <a href="#tentang" className="hover:text-tertiary transition-colors">Tentang</a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <a
              href="#pesan"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-tertiary hover:bg-tertiary/90 text-primary transition shadow-sm hover:shadow-tertiary/20"
            >
              PO Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-quaternary/60 hover:text-quaternary hover:bg-secondary/20 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-secondary/30 bg-secondary/5 px-4 pt-2 pb-4 space-y-2">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
          >
            Home
          </a>
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
          >
            Menu
          </a>
          <a
            href="#cara-po"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
          >
            Cara PO
          </a>
          <a
            href="#tentang"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
          >
            Tentang
          </a>
          <div className="pt-2">
            <a
              href="#pesan"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2 font-semibold text-sm rounded-lg bg-tertiary hover:bg-tertiary/90 text-primary transition"
            >
              PO Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
