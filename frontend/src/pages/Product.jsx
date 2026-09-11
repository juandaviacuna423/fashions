import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaStar, FaShoppingBag, FaArrowLeft, FaTruck, FaUndo, FaShieldAlt, FaCheck } from 'react-icons/fa'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Product({ onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        if (data.sizes?.length) setSelectedSize(data.sizes[0])
        if (data.colors?.length) setSelectedColor(data.colors[0])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    if (product.sizes?.length && !selectedSize) return setError('Por favor selecciona una talla')
    setError('')
    onAddToCart(product, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="spinner" />
    </div>
  )

  if (!product) return (
    <div className="text-center py-20 text-zinc-500">
      <p className="text-xl mb-4">Producto no encontrado</p>
      <Link to="/" className="text-gold hover:underline">Volver al inicio</Link>
    </div>
  )

  const hasDiscount = product.sale_price && product.sale_price < product.price
  const discount = hasDiscount ? Math.round((1 - product.sale_price / product.price) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <button onClick={() => navigate(-1)} className="hover:text-gold transition-colors flex items-center gap-1.5">
          <FaArrowLeft size={12} /> Volver
        </button>
        <span>/</span>
        <Link to={`/categoria/${product.category_slug}`} className="hover:text-gold transition-colors">{product.category_name}</Link>
        <span>/</span>
        <span className="text-zinc-300 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-square">
          <img src={product.image_url} alt={product.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = `https://placehold.co/600x600/1a1a1a/c8a96e?text=${encodeURIComponent(product.name)}`; e.target.onerror = null }} />
        </div>

        {/* Details */}
        <div>
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {product.is_new === 1 && <span className="badge-new">Nuevo</span>}
            {hasDiscount && <span className="badge-sale">-{discount}% OFF</span>}
            {product.is_featured === 1 && <span className="badge-featured">⭐ Destacado</span>}
          </div>

          <p className="text-gold text-xs font-bold uppercase tracking-[3px] mb-2">{product.category_name}</p>
          <h1 className="text-3xl font-black leading-tight mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex text-gold gap-0.5">
              {[...Array(5)].map((_, i) => <FaStar key={i} size={14} className={i < Math.round(product.rating) ? '' : 'opacity-20'} />)}
            </div>
            <span className="font-bold text-sm">{product.rating}</span>
            <span className="text-zinc-500 text-sm">({product.reviews_count} reseñas)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6 pb-6 border-b border-zinc-800">
            <span className="text-4xl font-black">
              ${hasDiscount ? Number(product.sale_price).toFixed(2) : Number(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-zinc-500 line-through font-semibold">${Number(product.price).toFixed(2)}</span>
                <span className="text-emerald-400 text-sm font-bold mb-1">Ahorras ${(product.price - product.sale_price).toFixed(2)}</span>
              </>
            )}
          </div>

          <p className="text-zinc-400 leading-relaxed mb-7">{product.description}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">
                Color: <span className="text-gold">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${selectedColor === c ? 'border-gold bg-gold/10 text-gold' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-7">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">
                Talla: <span className="text-gold">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => { setSelectedSize(s); setError('') }}
                    className={`min-w-[48px] h-11 px-3 rounded-xl border-2 text-sm font-bold transition-all ${selectedSize === s ? 'border-gold bg-gold/10 text-gold' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
            </div>
          )}

          {/* Add to Cart */}
          <button onClick={handleAdd}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${added ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'btn-gold'}`}>
            {added ? <><FaCheck /> ¡Agregado al carrito!</> : <><FaShoppingBag /> Agregar al Carrito</>}
          </button>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: <FaTruck size={14} />, text: 'Envío gratis' },
              { icon: <FaUndo size={14} />, text: '30 días devolución' },
              { icon: <FaShieldAlt size={14} />, text: 'Pago seguro' },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                <span className="text-gold">{t.icon}</span>
                <span className="text-xs text-zinc-500 leading-tight">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
