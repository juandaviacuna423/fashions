import { Link } from 'react-router-dom'
import { FaStar, FaShoppingBag, FaHeart } from 'react-icons/fa'

export default function ProductCard({ product }) {
  const hasDiscount = product.sale_price && product.sale_price < product.price
  const discount = hasDiscount ? Math.round((1 - product.sale_price / product.price) * 100) : 0

  return (
    <div className="card group relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.is_featured === 1 && !product.is_new && <span className="badge-featured">⭐ Destacado</span>}
        {product.is_new === 1 && <span className="badge-new">Nuevo</span>}
        {hasDiscount && <span className="badge-sale">-{discount}%</span>}
      </div>

      {/* Image */}
      <Link to={`/producto/${product.id}`} className="block overflow-hidden aspect-[4/5] bg-zinc-800">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = `https://placehold.co/400x500/1a1a1a/c8a96e?text=${encodeURIComponent(product.name)}`; e.target.onerror = null; }}
        />
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">{product.category_name}</p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-zinc-100 mb-2 line-clamp-2 hover:text-gold transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={11} className={i < Math.round(product.rating) ? 'opacity-100' : 'opacity-20'} />
            ))}
          </div>
          <span className="text-xs text-zinc-500">({product.reviews_count})</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-black text-zinc-100">
              ${hasDiscount ? Number(product.sale_price).toFixed(2) : Number(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-zinc-500 line-through ml-2">${Number(product.price).toFixed(2)}</span>
            )}
          </div>
          <Link to={`/producto/${product.id}`}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-black hover:shadow-lg hover:shadow-gold/30 transition-all hover:scale-110 shrink-0">
            <FaShoppingBag size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
