import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { FaArrowRight, FaShieldAlt, FaTruck, FaUndo, FaStar } from 'react-icons/fa'

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')

const CATEGORIES = [
  { slug: 'hombre', label: 'Hombre', emoji: '👔', color: 'from-blue-900/60 to-blue-950/80', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&auto=format' },
  { slug: 'mujer', label: 'Mujer', emoji: '👗', color: 'from-rose-900/60 to-rose-950/80', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&auto=format' },
  { slug: 'ninos', label: 'Niños', emoji: '⚽', color: 'from-emerald-900/60 to-emerald-950/80', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=700&auto=format' },
  { slug: 'ninas', label: 'Niñas', emoji: '🎀', color: 'from-pink-900/60 to-pink-950/80', img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf5?w=700&auto=format' },
]

const TRUST = [
  { icon: <FaTruck size={22} />, title: 'Envío Gratis', desc: 'En pedidos mayores a $50' },
  { icon: <FaUndo size={22} />, title: 'Devoluciones', desc: '30 días sin preguntas' },
  { icon: <FaShieldAlt size={22} />, title: 'Pago Seguro', desc: 'Encriptación SSL 256-bit' },
  { icon: <FaStar size={22} />, title: 'Calidad Premium', desc: 'Garantía de satisfacción' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/products?featured=true&limit=8`).then(r => r.json()),
      fetch(`${API}/products?is_new=true&limit=4`).then(r => r.json()),
    ]).then(([feat, news]) => {
      setFeatured(feat)
      setNewProducts(news)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 z-0"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, #c8a96e 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5 rounded-full blur-3xl z-0"
          style={{ background: '#c8a96e' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-[3px] mb-6">
              ✨ Colección Otoño / Invierno 2026
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter mb-6">
              Moda que<br />
              <span className="gold-text">transforma</span><br />
              tu imagen
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              Descubre nuestra colección premium para toda la familia. Diseño, calidad y estilo en cada prenda.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/categoria/mujer" className="btn-gold text-base">
                Ver Colección <FaArrowRight />
              </Link>
              <Link to="/promociones" className="btn-outline text-base">
                🔥 Ver Ofertas
              </Link>
            </div>
            <div className="flex gap-8 mt-12 pt-8 border-t border-zinc-800">
              {[['500+', 'Productos'], ['10K+', 'Clientes'], ['4.8★', 'Valoración']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-gold">{num}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <div className="border-y border-zinc-900 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-zinc-900">
            {TRUST.map(t => (
              <div key={t.title} className="flex items-center gap-4 px-6 py-5">
                <span className="text-gold shrink-0">{t.icon}</span>
                <div>
                  <p className="font-bold text-sm text-zinc-200">{t.title}</p>
                  <p className="text-xs text-zinc-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMPANY INFO ─────────────────────────────────────────────────── */}
      <section className="bg-zinc-900 border-b border-zinc-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold font-bold uppercase tracking-[3px] text-xs mb-3 block">Nuestra Historia</span>
              <h2 className="text-3xl sm:text-4xl font-black mb-6">Más que una tienda, <br /><span className="gold-text">un estilo de vida.</span></h2>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                En <strong>FashionStore</strong>, creemos que la moda debe ser accesible, sostenible y de máxima calidad. Fundada en 2026, nuestra empresa nació con la misión de transformar la manera en que las familias compran ropa, ofreciendo prendas premium que combinan diseño contemporáneo con confort absoluto.
              </p>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Trabajamos directamente con artesanos y fábricas éticas alrededor del mundo, asegurando que cada puntada refleje nuestra dedicación a la excelencia. Ya sea que busques el traje perfecto, un vestido elegante o ropa resistente para los más pequeños, estamos aquí para vestirte en tus mejores momentos.
              </p>
              <Link to="/promociones" className="btn-outline">Conoce Nuestras Ofertas</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold to-gold-light rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format" alt="Nuestra tienda" className="relative rounded-3xl object-cover w-full h-[400px] shadow-2xl shadow-black/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <h2 className="section-title mb-2">Explora por <span className="gold-text">Categoría</span></h2>
          <p className="text-zinc-500">Moda para toda la familia</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] group border border-zinc-800 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} flex flex-col justify-end p-5`}>
                <span className="text-2xl mb-1">{cat.emoji}</span>
                <h3 className="text-xl font-black text-white">{cat.label}</h3>
                <span className="flex items-center gap-1 text-sm text-white/70 mt-1 group-hover:gap-2 transition-all">
                  Ver todo <FaArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────────────── */}
      <div className="mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto mb-16">
        <div className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #c8a96e 0%, #a8864a 50%, #7a5f2e 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 0px, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-black/70 text-sm font-bold uppercase tracking-widest mb-2">Oferta Limitada 🔥</p>
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-2">¡Hasta 40% OFF!</h2>
              <p className="text-black/70">En selección de temporada. Solo por tiempo limitado.</p>
            </div>
            <Link to="/promociones"
              className="shrink-0 bg-black text-gold font-bold px-8 py-4 rounded-xl hover:bg-zinc-900 transition-colors flex items-center gap-2 whitespace-nowrap">
              Ver Ofertas <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="section-title mb-1">Lo más <span className="gold-text">Popular</span></h2>
            <p className="text-zinc-500">Los favoritos de nuestra comunidad</p>
          </div>
          <Link to="/categoria/hombre" className="hidden sm:flex items-center gap-2 text-gold text-sm font-semibold hover:underline">
            Ver todo <FaArrowRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="bg-zinc-950 border-t border-zinc-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="section-title mb-1">Nuevas <span className="gold-text">Llegadas</span></h2>
                <p className="text-zinc-500">Lo último en tendencias</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
