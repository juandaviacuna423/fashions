import { Link } from 'react-router-dom'
import { FaTrash, FaShoppingBag, FaArrowRight, FaLock } from 'react-icons/fa'

export default function Cart({ cart, setCart, onCheckout }) {
  const updateQty = (item, qty) => {
    if (qty < 1) return
    setCart(prev => prev.map(i =>
      (i.id === item.id && i.size === item.size && i.color === item.color)
        ? { ...i, quantity: qty } : i
    ))
  }

  const remove = (item) => {
    setCart(prev => prev.filter(i =>
      !(i.id === item.id && i.size === item.size && i.color === item.color)
    ))
  }

  const subtotal = cart.reduce((acc, i) => acc + ((i.sale_price || i.price) * i.quantity), 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <FaShoppingBag className="mx-auto text-zinc-800 mb-6" size={72} />
        <h2 className="text-2xl font-black mb-3">Tu carrito está vacío</h2>
        <p className="text-zinc-500 mb-8">¡Explora nuestra colección y agrega lo que más te guste!</p>
        <Link to="/" className="btn-gold">Ir a la Tienda <FaArrowRight /></Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black mb-8">Tu Carrito <span className="text-zinc-500 text-xl font-semibold">({cart.length} {cart.length === 1 ? 'artículo' : 'artículos'})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div key={idx} className="flex gap-5 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-colors">
              <Link to={`/producto/${item.id}`} className="shrink-0">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-zinc-800">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex-grow flex flex-col justify-between min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-gold text-xs font-bold uppercase tracking-wider mb-1">{item.category_name}</p>
                    <Link to={`/producto/${item.id}`}>
                      <h3 className="font-bold text-base sm:text-lg hover:text-gold transition-colors line-clamp-2 leading-snug">{item.name}</h3>
                    </Link>
                    <div className="flex gap-3 mt-1.5 text-xs text-zinc-500">
                      {item.color && <span>Color: <span className="text-zinc-300">{item.color}</span></span>}
                      {item.size && <span>Talla: <span className="text-zinc-300">{item.size}</span></span>}
                    </div>
                  </div>
                  <button onClick={() => remove(item)} className="text-zinc-600 hover:text-rose-500 transition-colors p-1.5 shrink-0 h-fit">
                    <FaTrash size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(item, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-bold text-lg">−</button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-bold text-lg">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg">${((item.sale_price || item.price) * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && <p className="text-xs text-zinc-500">${(item.sale_price || item.price).toFixed(2)} c/u</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl sticky top-28">
            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

            <div className="space-y-3 mb-5">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-zinc-400 truncate max-w-[170px]">{item.name} x{item.quantity}</span>
                  <span className="text-zinc-300 font-semibold shrink-0">${((item.sale_price || item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Envío</span>
                {shipping === 0
                  ? <span className="text-emerald-400 font-semibold">¡Gratis!</span>
                  : <span>${shipping.toFixed(2)}</span>}
              </div>
              {subtotal < 50 && (
                <p className="text-xs text-zinc-500 bg-zinc-800 rounded-lg p-2">
                  ¡Añade ${(50 - subtotal).toFixed(2)} más para envío gratis!
                </p>
              )}
            </div>

            <div className="flex justify-between items-center py-4 border-t border-zinc-700 mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-2xl gold-text">${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn-gold w-full text-base py-4 mb-3">
              <FaLock size={14} /> Proceder al Pago
            </Link>

            <Link to="/" className="block text-center text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
              ← Continuar Comprando
            </Link>

            <div className="flex items-center justify-center gap-2 mt-5 text-zinc-600 text-xs">
              <FaLock size={10} /> Pago 100% seguro y encriptado
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
