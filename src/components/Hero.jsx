import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerProductList } from '../services/productService';

export default function Hero() {
  const [featuredProduct, setFeaturedProduct] = useState(null);

  useEffect(() => {
    let active = true;
    getCustomerProductList()
      .then((products) => {
        if (active) setFeaturedProduct(products.find((product) => product.image) || null);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <section id='home' className='scroll-mt-20 py-16 md:py-24 border-b border-secondary/30'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          {/* Text Info */}
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-primary leading-tight'>
                Homemade Cake <br />
                <span className='text-tertiary'>for Your Special Moment</span>
              </h1>
              <p className='text-primary/70 text-lg sm:text-xl leading-relaxed mt-4'>
                Kue dibuat fresh berdasarkan pesanan. <br />
                Pilih kue favoritmu dan tentukan tanggal pengambilan.
              </p>
            </div>

            <div className='flex flex-wrap gap-4 pt-2'>
                <Link to='/produk' className='px-6 py-3 text-base font-medium rounded-lg bg-primary text-tertiary hover:bg-primary/90 transition shadow-lg shadow-tertiary/20'>
                Pesan Sekarang
              </Link>
              <a href='#menu' className='px-6 py-3 text-base font-medium rounded-lg border border-secondary/50 bg-secondary/10 text-primary hover:bg-secondary/20 transition'>
                Lihat Menu
              </a>
            </div>
          </div>

          <div className='flex justify-center'>
            <div className='relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/15 via-quaternary to-tertiary/20 shadow-lg'>
              {featuredProduct?.image ? (
                <img src={featuredProduct.image} alt={featuredProduct.name} className='h-full w-full object-cover' onError={() => setFeaturedProduct(null)} />
              ) : (
                <div className='flex h-full flex-col items-center justify-center p-8 text-center'>
                  <span className='text-6xl' aria-hidden='true'>🍰</span>
                  <p className='mt-4 text-lg font-semibold text-primary'>Kue untuk momen spesial</p>
                  <p className='mt-2 max-w-xs text-sm text-primary/60'>Foto produk akan tampil di sini setelah tersedia di katalog.</p>
                </div>
              )}
              {featuredProduct?.image && <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-12 text-white'>
                <p className='text-xs font-medium uppercase tracking-wider text-white/75'>Pilihan dari katalog</p>
                <p className='mt-1 text-xl font-semibold'>{featuredProduct.name}</p>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
