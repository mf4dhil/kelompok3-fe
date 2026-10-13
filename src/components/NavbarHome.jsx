// import { useState } from 'react';

// export default function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <header className="border-b border-secondary/30 bg-primary/80 backdrop-blur sticky top-0 z-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center gap-2">
//             <span className="text-2xl" role="img" aria-label="cake">🍰</span>
//             <span className="font-bold text-xl tracking-tight text-quaternary">NIFACake</span>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-quaternary/80">
//             <a href="#home" className="hover:text-tertiary transition-colors">Home</a>
//             <a href="#menu" className="hover:text-tertiary transition-colors">Menu</a>
//             <a href="#cara-po" className="hover:text-tertiary transition-colors">Cara PO</a>
//             <a href="#tentang" className="hover:text-tertiary transition-colors">Tentang</a>
//           </nav>

//           {/* Action Button */}
//           <div className="hidden md:flex items-center">
//             <a
//               href="#pesan"
//               className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-tertiary hover:bg-tertiary/90 text-primary transition shadow-sm hover:shadow-tertiary/20"
//             >
//               PO Now
//             </a>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               type="button"
//               className="p-2 rounded-md text-quaternary/60 hover:text-quaternary hover:bg-secondary/20 focus:outline-none"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 {mobileMenuOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu dropdown */}
//       {mobileMenuOpen && (
//         <div className="md:hidden border-b border-secondary/30 bg-secondary/5 px-4 pt-2 pb-4 space-y-2">
//           <a
//             href="#home"
//             onClick={() => setMobileMenuOpen(false)}
//             className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
//           >
//             Home
//           </a>
//           <a
//             href="#menu"
//             onClick={() => setMobileMenuOpen(false)}
//             className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
//           >
//             Menu
//           </a>
//           <a
//             href="#cara-po"
//             onClick={() => setMobileMenuOpen(false)}
//             className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
//           >
//             Cara PO
//           </a>
//           <a
//             href="#tentang"
//             onClick={() => setMobileMenuOpen(false)}
//             className="block px-3 py-2 rounded-md text-base font-medium text-quaternary/90 hover:bg-secondary/20 hover:text-tertiary"
//           >
//             Tentang
//           </a>
//           <div className="pt-2">
//             <a
//               href="#pesan"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block w-full text-center px-4 py-2 font-semibold text-sm rounded-lg bg-tertiary hover:bg-tertiary/90 text-primary transition"
//             >
//               PO Now
//             </a>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }



import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function NavbarHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return undefined;
    const frame = requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  const goToSection = (id) => (event) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    const hash = `#${id}`;
    if (location.pathname === '/' && location.hash === hash) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate({ pathname: '/', hash });
    }
  };

  const goHome = (event) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-secondary/30 bg-primary/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" onClick={goHome} className="flex shrink-0 items-center gap-2">
            <span className="text-2xl" role="img" aria-label="cake">🍰</span>
            <span className="text-xl font-bold tracking-tight text-quaternary">NIFACake</span>
          </Link>

          {/* Navigasi desktop */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-quaternary/80 md:flex">
            <Link to="/" onClick={goHome} className="transition hover:text-tertiary">Home</Link>
            <Link to="/#menu" onClick={goToSection('menu')} className="transition hover:text-tertiary">Menu</Link>
            <Link to="/#cara-po" onClick={goToSection('cara-po')} className="transition hover:text-tertiary">Cara PO</Link>
            <Link to="/#tentang" onClick={goToSection('tentang')} className="transition hover:text-tertiary">Tentang</Link>
          </nav>

          {/* Aksi desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/keranjang"
              aria-label={`Keranjang, ${totalItems} item`}
              className="relative inline-flex items-center justify-center rounded-lg p-2 text-quaternary transition hover:bg-secondary/20"
            >
              <ShoppingCart size={22} />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-tertiary px-1 text-xs font-bold text-primary">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/produk"
              className="inline-flex items-center justify-center rounded-lg bg-tertiary px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-tertiary/90"
            >
              PO Now
            </Link>
          </div>

          {/* Aksi mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/keranjang"
              aria-label={`Keranjang, ${totalItems} item`}
              className="relative rounded-lg p-2 text-quaternary"
            >
              <ShoppingCart size={22} />

              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-tertiary px-1 text-[10px] font-bold text-primary">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-2 text-quaternary hover:bg-secondary/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown mobile */}
      {mobileMenuOpen && (
        <div className="space-y-2 border-b border-secondary/30 bg-primary px-4 pb-4 pt-2 md:hidden">
          <Link
            to="/"
            onClick={goHome}
            className="block rounded-md px-3 py-2 text-quaternary hover:bg-secondary/20"
          >
            Home
          </Link>

          <Link
            to="/#menu"
            onClick={goToSection('menu')}
            className="block rounded-md px-3 py-2 text-quaternary hover:bg-secondary/20"
          >
            Menu
          </Link>

          <Link
            to="/#cara-po"
            onClick={goToSection('cara-po')}
            className="block rounded-md px-3 py-2 text-quaternary hover:bg-secondary/20"
          >
            Cara PO
          </Link>

          <Link
            to="/#tentang"
            onClick={goToSection('tentang')}
            className="block rounded-md px-3 py-2 text-quaternary hover:bg-secondary/20"
          >
            Tentang
          </Link>

          <Link
            to="/produk"
            className="block w-full rounded-lg bg-tertiary px-4 py-2 text-center text-sm font-semibold text-primary"
          >
            PO Now
          </Link>
        </div>
      )}
    </header>
  );
}
