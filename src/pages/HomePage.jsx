import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, CakeSlice, CalendarCheck, Check, ChevronDown, Clock3, CreditCard, Menu, PackageCheck, ShoppingBag, Sparkles, X } from 'lucide-react';
import { getCustomerProductList } from '../services/productService';
import { formatRupiah } from '../utils/formatRupiah';

const orderSteps = [
  ['Pilih kue dan varian', 'Jelajahi katalog, lalu pilih bentuk, ukuran, dan rasa yang tersedia.'],
  ['Atur keranjang', 'Periksa pilihan kue dan jumlahnya sebelum melanjutkan.'],
  ['Isi data pemesan', 'Masukkan nomor HP, nama, tanggal pengambilan, dan catatan bila perlu.'],
  ['Tunggu konfirmasi admin', 'Admin menghubungi untuk memastikan order. Transfer diverifikasi sebelum produksi; pembayaran tunai dapat dilakukan kemudian sesuai kesepakatan.'],
  ['Lacak dan simpan struk', 'Gunakan nomor order untuk memantau progres, lalu simpan struk sebagai referensi.'],
];

const faqs = [
  ['Apakah saya harus membuat akun?', 'Tidak. Anda bisa memilih kue, mengisi data pemesan, dan checkout sebagai tamu.'],
  ['Bagaimana cara memilih ukuran dan rasa?', 'Buka detail produk dari katalog untuk melihat varian yang tersedia beserta harganya.'],
  ['Apakah pesanan bisa diantar?', 'Saat ini checkout mendukung pengambilan pesanan. Tanggal pengambilan dipilih saat checkout.'],
  ['Metode pembayaran apa yang tersedia?', 'Checkout menyediakan tunai atau transfer. Admin mengonfirmasi order setelah memastikan customer ingin melanjutkan; pembayaran tunai dicatat saat uang diterima dan transfer diverifikasi dari dana yang masuk.'],
  ['Bagaimana menyimpan dan melacak pesanan?', 'Cetak atau simpan struk, lalu gunakan nomor order pada halaman Lacak Pesanan untuk memeriksa progres.'],
];

function Reveal({ children, className, delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: 'easeOut' }}>{children}</motion.div>;
}

function PriceRange({ range }) {
  if (!range) return <span className="text-sm font-semibold text-primary/50">Harga belum tersedia</span>;
  if (range.min === range.max) return <span className="font-semibold text-secondary">{formatRupiah(range.min)}</span>;
  return <span className="font-semibold text-secondary">{formatRupiah(range.min)} – {formatRupiah(range.max)}</span>;
}

function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['Beranda', '#beranda'], ['Menu Kue', '#menu'], ['Cara Pesan', '#cara-pesan'], ['FAQ', '#faq']];

  return <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/5 bg-quaternary/90 shadow-sm backdrop-blur-xl">
    <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Navigasi utama">
      <a href="#beranda" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg text-xl font-bold text-primary focus-visible:outline-2 focus-visible:outline-secondary">
        <span className="grid size-10 place-items-center rounded-xl bg-tertiary"><CakeSlice size={21}/></span>NIFACake
      </a>
      <div className="hidden items-center gap-7 md:flex">
        {links.slice(1).map(([label, href]) => <a key={href} href={href} className="text-sm font-medium text-primary/70 transition hover:text-secondary">{label}</a>)}
        <Link to="/lacak-pesanan" className="text-sm font-medium text-primary/70 transition hover:text-secondary">Lacak Pesanan</Link>
      </div>
      <div className="hidden md:block"><Link to="/produk" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary/90">Pilih kue <ArrowRight size={17}/></Link></div>
      <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={menuOpen} className="grid size-11 place-items-center rounded-xl bg-white text-primary shadow-sm md:hidden">{menuOpen ? <X/> : <Menu/>}</button>
    </nav>
    <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-primary/5 bg-quaternary px-4 pb-5 pt-2 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-1">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-medium text-primary/80 hover:bg-white">{label}</a>)}<Link to="/lacak-pesanan" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-medium text-primary/80 hover:bg-white">Lacak Pesanan</Link><Link to="/produk" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex justify-center rounded-xl bg-secondary px-5 py-3 font-semibold text-white">Pilih kue <ArrowRight size={17} className="ml-2"/></Link></div>
    </motion.div>}</AnimatePresence>
  </header>;
}

function SectionHeading({ eyebrow, title, description, light = false }) {
  return <div className="mx-auto mb-12 max-w-2xl text-center">
    <span className={`mb-3 block text-xs font-bold uppercase tracking-[0.2em] ${light ? 'text-tertiary' : 'text-secondary'}`}>{eyebrow}</span>
    <h2 className={`text-3xl font-bold leading-tight sm:text-4xl md:text-5xl ${light ? 'text-quaternary' : 'text-primary'}`}>{title}</h2>
    {description && <p className={`mt-4 leading-relaxed ${light ? 'text-quaternary/70' : 'text-primary/65'}`}>{description}</p>}
  </div>;
}

function Hero({ product }) {
  const reduceMotion = useReducedMotion();
  return <section id="beranda" className="scroll-mt-20 overflow-hidden pb-20 pt-28 sm:pt-32 md:pb-28 md:pt-40">
    <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
      <motion.div className="relative z-10" initial={reduceMotion ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}>
        <span className="inline-flex items-center gap-2 rounded-full bg-tertiary/60 px-4 py-2 text-sm font-semibold text-primary"><Sparkles size={16}/> Kue untuk momen spesial</span>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl md:text-6xl">Manisnya momen, <span className="text-secondary">dimulai dari sini.</span></h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-primary/65 md:text-lg">Pilih kue dan varian favoritmu, tentukan tanggal pengambilan, lalu pesan langsung dari katalog tanpa membuat akun.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/produk" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">Pesan sekarang <ShoppingBag size={18}/></Link>
          <a href="#menu" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-tertiary px-6 py-3 font-semibold text-primary transition hover:-translate-y-0.5">Lihat menu <ArrowDown size={17}/></a>
        </div>
        <div className="mt-9 grid gap-3 text-sm font-medium text-primary/75 sm:grid-cols-3">
          {['Checkout tanpa akun', 'Varian dan harga jelas', 'Struk bisa disimpan'].map((benefit) => <div key={benefit} className="flex items-start gap-2"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary"><Check size={13} strokeWidth={3}/></span>{benefit}</div>)}
        </div>
      </motion.div>
      <motion.div className="relative mx-auto w-full max-w-xl px-3 py-3 sm:px-6" initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}>
        <div className="absolute inset-0 rotate-3 rounded-[2.5rem] bg-tertiary/65"/><div className="absolute -right-2 -top-4 size-32 rounded-full bg-secondary/15 blur-sm sm:-right-4"/>
        <div className="relative aspect-[4/4.4] overflow-hidden rounded-[2rem] border-8 border-white bg-gradient-to-br from-secondary/15 via-white to-tertiary/40 shadow-[0_24px_65px_rgba(43,27,23,0.16)] sm:aspect-square">
          {product?.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }}/> : <div className="flex h-full flex-col items-center justify-center text-center"><span className="text-7xl">🍰</span><p className="mt-4 font-semibold text-primary">Kreasi NIFACake</p><p className="mt-1 text-sm text-primary/55">Foto produk tampil saat tersedia di katalog</p></div>}
          {product?.image && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-16 text-white"><span className="text-xs font-semibold uppercase tracking-widest text-white/75">Pilihan dari katalog</span><h2 className="mt-1 text-xl font-bold">{product.name}</h2><PriceRange range={product.priceRange}/></div>}
        </div>
        <motion.div className="absolute -left-1 top-12 rounded-2xl bg-white p-3 shadow-xl sm:-left-4 sm:p-4" animate={reduceMotion ? {} : { y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><span className="grid size-9 place-items-center rounded-xl bg-tertiary"><CalendarCheck size={18}/></span><strong className="mt-2 block text-sm text-primary">Jadwal pilihanmu</strong><p className="text-xs text-primary/55">Atur tanggal pengambilan</p></motion.div>
        <motion.div className="absolute -bottom-2 right-1 rounded-2xl bg-white p-3 shadow-xl sm:right-0 sm:p-4" animate={reduceMotion ? {} : { y: [0, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}><span className="grid size-9 place-items-center rounded-xl bg-secondary/15 text-secondary"><CreditCard size={18}/></span><strong className="mt-2 block text-sm text-primary">Bayar dengan mudah</strong><p className="text-xs text-primary/55">Tunai atau transfer</p></motion.div>
      </motion.div>
    </div>
  </section>;
}

function FeatureSection() {
  const reduceMotion = useReducedMotion();
  const features = [
    [CakeSlice, 'Pilih Varian', 'Lihat bentuk, ukuran, rasa, dan harga yang tersedia untuk setiap kue.'],
    [ShoppingBag, 'Pesan Tanpa Akun', 'Checkout langsung dengan data kontak yang diperlukan untuk pesanan.'],
    [CalendarCheck, 'Pengambilan Terjadwal', 'Pilih tanggal pengambilan saat mengisi form checkout.'],
    [PackageCheck, 'Simpan Struk', 'Nomor pesanan dan rincian kue tersedia pada struk setelah order berhasil.'],
  ];
  return <section className="bg-white py-16 md:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeading eyebrow="Kenapa NIFACake?" title="Mudah dipesan, jelas rinciannya" description="Informasi produk dan langkah pemesanan tersedia sejak pelanggan memilih kue hingga menerima struk."/>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(([Icon, title, desc], index) => <Reveal key={title} delay={index * 0.08}><motion.article whileHover={reduceMotion ? {} : { y: -5 }} transition={{ duration: 0.2 }} className="h-full rounded-2xl border border-primary/5 bg-quaternary/70 p-6 shadow-[0_8px_30px_rgba(43,27,23,0.05)]"><span className="mb-5 grid size-12 place-items-center rounded-2xl bg-tertiary/80 text-primary"><Icon size={23}/></span><h3 className="font-semibold text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed text-primary/60">{desc}</p></motion.article></Reveal>)}</div>
  </div></section>;
}

function MenuSection({ products, loading, error }) {
  const reduceMotion = useReducedMotion();
  const [category, setCategory] = useState('Semua');
  const categories = useMemo(() => ['Semua', ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);
  const filtered = category === 'Semua' ? products : products.filter((product) => product.category === category);
  return <section id="menu" className="scroll-mt-20 py-16 md:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeading eyebrow="Menu Pilihan" title="Temukan kue favoritmu" description="Lihat produk yang tersedia, cek rentang harga varian, dan pilih kue untuk momen istimewamu."/>
    {categories.length > 1 && <div className="mb-9 flex flex-wrap justify-center gap-2">{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${category === item ? 'bg-secondary text-white shadow-md' : 'bg-white text-primary/65 hover:bg-tertiary/50'}`}>{item}</button>)}</div>}
    {loading && <p className="py-12 text-center text-primary/60">Memuat menu kue…</p>}
    {error && <p role="alert" className="py-12 text-center text-red-700">Menu kue belum bisa dimuat. Silakan coba lagi nanti.</p>}
    {!loading && !error && products.length === 0 && <div className="rounded-2xl bg-white p-10 text-center text-primary/60">Belum ada kue yang tersedia di katalog.</div>}
    {!loading && !error && filtered.length > 0 && <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice(0, 6).map((product, index) => <motion.article layout key={product.id} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : index * 0.06 }} whileHover={reduceMotion ? {} : { y: -5 }} className="group overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(43,27,23,0.07)] transition hover:shadow-xl">
      <Link to={`/products/${product.id}`} aria-label={`Lihat ${product.name}`} className="block aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary/10 to-tertiary/20">{product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = 'none'; }}/> : <div className="grid h-full place-items-center text-6xl">🍰</div>}</Link>
      <div className="p-5 sm:p-6"><span className="inline-flex rounded-full bg-tertiary/70 px-3 py-1 text-xs font-semibold text-primary">{product.category || 'Kue pilihan'}</span><h3 className="mt-3 text-lg font-semibold text-primary">{product.name}</h3><p className="mt-2 min-h-10 text-sm leading-relaxed text-primary/60">{product.description || 'Pilih varian yang tersedia untuk melihat detail produk.'}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-primary/5 pt-4"><div><span className="mb-1 block text-xs text-primary/50">Rentang harga</span><PriceRange range={product.priceRange}/></div><Link to={`/products/${product.id}`} className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90">Detail <ArrowRight size={16}/></Link></div></div>
    </motion.article>)}</motion.div>}
    {!loading && !error && products.length > 6 && <div className="mt-10 text-center"><Link to="/produk" className="inline-flex items-center gap-2 rounded-xl border border-secondary px-6 py-3 font-semibold text-secondary transition hover:bg-secondary hover:text-white">Lihat semua kue <ArrowRight size={17}/></Link></div>}
  </div></section>;
}

function FlavorMarquee({ products }) {
  const flavors = [...new Set(products.flatMap((product) => product.flavors || []))];
  if (!flavors.length) return null;
  return <section className="overflow-hidden bg-white py-14 md:py-20"><SectionHeading eyebrow="Pilihan varian" title="Rasa yang tersedia" description="Pilihan rasa mengikuti varian aktif pada katalog."/><div className="space-y-3">{[false, true].map((reverse) => <div key={String(reverse)} className="marquee-row flex w-max gap-3" data-reverse={reverse}>{[...flavors, ...flavors].map((flavor, index) => <span key={`${flavor}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-quaternary px-5 py-3 font-medium text-primary shadow-sm"><span className="size-2 rounded-full bg-secondary"/>{flavor}</span>)}</div>)}</div></section>;
}

function HowToOrder() {
  const reduceMotion = useReducedMotion();
  return <section id="cara-pesan" className="scroll-mt-20 bg-primary py-16 text-quaternary md:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeading light eyebrow="Mudah & terjadwal" title="Cara melakukan pemesanan" description="Lima langkah sederhana dari memilih kue sampai menyimpan struk."/>
    <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5">{orderSteps.map(([title, desc], index) => <Reveal key={title} delay={index * 0.08}><motion.article whileHover={reduceMotion ? {} : { y: -4 }} className="relative flex gap-4 lg:block lg:text-center"><span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl bg-tertiary font-bold text-primary shadow-[0_0_0_7px_rgba(43,27,23,1)] lg:mx-auto">{index + 1}</span><div className="pt-1 lg:pt-7"><span className="text-xs font-semibold uppercase tracking-widest text-tertiary">Langkah {index + 1}</span><h3 className="mt-2 font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-quaternary/65">{desc}</p></div></motion.article></Reveal>)}</div>
  </div></section>;
}

function OrderInfo() {
  const items = [[Clock3, 'Tanggal pengambilan dipilih saat checkout'], [CreditCard, 'Pembayaran tunai atau transfer rekening aktif'], [ShoppingBag, 'Tidak perlu login atau membuat akun'], [PackageCheck, 'Cetak atau simpan struk setelah order berhasil']];
  return <section className="py-16 md:py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><div className="relative overflow-hidden rounded-[2rem] bg-tertiary p-7 shadow-[0_20px_55px_rgba(43,27,23,0.12)] md:p-11"><CakeSlice className="absolute -right-5 -top-6 size-40 text-primary/5"/><div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><span className="text-xs font-bold uppercase tracking-widest text-primary/60">Sebelum memesan</span><h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">Info pemesanan</h2><p className="mt-4 text-sm leading-relaxed text-primary/70">Pemesanan online saat ini untuk pengambilan. Detail pesanan dapat disimpan dari halaman konfirmasi.</p></div><div className="grid gap-3 sm:grid-cols-2">{items.map(([Icon, text]) => <div key={text} className="flex items-start gap-3 rounded-2xl bg-white/60 p-4"><Icon className="mt-0.5 shrink-0 text-secondary" size={19}/><span className="text-sm font-medium leading-relaxed text-primary">{text}</span></div>)}</div></div></div></div></section>;
}

function FAQ() {
  const [active, setActive] = useState(0);
  return <section id="faq" className="scroll-mt-20 bg-white py-16 md:py-24"><div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"><SectionHeading eyebrow="Pertanyaan umum" title="Yang sering ditanyakan" description="Informasi ringkas sebelum Anda memesan."/><div className="space-y-3">{faqs.map(([question, answer], index) => <article key={question} className="overflow-hidden rounded-2xl bg-quaternary shadow-sm"><button type="button" onClick={() => setActive(active === index ? -1 : index)} aria-expanded={active === index} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-primary"><span>{question}</span><ChevronDown size={19} className={`shrink-0 transition-transform ${active === index ? 'rotate-180' : ''}`}/></button>{active === index && <p className="px-5 pb-5 text-sm leading-relaxed text-primary/65">{answer}</p>}</article>)}</div></div></section>;
}

function FinalCTA() {
  return <section className="bg-secondary py-16 text-center text-white md:py-20"><div className="mx-auto max-w-3xl px-4 sm:px-6"><span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-white/15"><CakeSlice/></span><h2 className="text-3xl font-bold md:text-5xl">Sudah menemukan kue favoritmu?</h2><p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/80">Pilih varian yang tersedia dan lengkapi pesananmu langsung di katalog.</p><Link to="/produk" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-tertiary px-6 py-3 font-semibold text-primary transition hover:shadow-lg">Lihat katalog <ArrowRight size={18}/></Link></div></section>;
}

function LandingFooter() {
  return <footer id="kontak" className="scroll-mt-20 bg-primary py-12 text-quaternary"><div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8"><div><a href="#beranda" className="inline-flex items-center gap-2 text-xl font-bold"><span className="grid size-9 place-items-center rounded-xl bg-tertiary text-primary"><CakeSlice size={19}/></span>NIFACake</a><p className="mt-4 max-w-sm text-sm leading-relaxed text-quaternary/60">Kue untuk momen spesial. Pilih produk, varian, dan jadwal pengambilan dari website.</p></div><div><h2 className="font-semibold">Jelajahi</h2><div className="mt-4 flex flex-col gap-3 text-sm text-quaternary/65"><a href="#menu" className="hover:text-tertiary">Menu kue</a><a href="#cara-pesan" className="hover:text-tertiary">Cara pemesanan</a><a href="#faq" className="hover:text-tertiary">FAQ</a></div></div><div><h2 className="font-semibold">Mulai pesan</h2><p className="mt-4 text-sm leading-relaxed text-quaternary/60">Checkout tersedia tanpa akun. Simpan struk setelah order berhasil.</p><Link to="/produk" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-tertiary px-4 py-2.5 text-sm font-semibold text-primary">Buka katalog <ArrowRight size={16}/></Link></div></div><div className="mx-auto mt-10 max-w-7xl border-t border-quaternary/10 px-4 pt-5 text-xs text-quaternary/40 sm:px-6 lg:px-8">© {new Date().getFullYear()} NIFACake.</div></footer>;
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getCustomerProductList().then((data) => { if (active) setProducts(data); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <div className="min-h-screen overflow-x-hidden bg-quaternary text-primary">
    <LandingNav/>
    <main><Hero product={products.find((product) => product.image)}/><FeatureSection/><MenuSection products={products} loading={loading} error={error}/><FlavorMarquee products={products}/><HowToOrder/><OrderInfo/><FAQ/><FinalCTA/></main>
    <LandingFooter/>
  </div>;
}
