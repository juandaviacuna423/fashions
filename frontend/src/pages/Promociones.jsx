import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { FaTag, FaFire } from 'react-icons/fa'

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')

export default function Promociones() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        const onSale = data.filter(p => p.sale_price && p.sale_price < p.price)
        setProducts(onSale)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
          <FaFire size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Ofertas <span className="text-rose-500">Especiales</span></h1>
        <p className="text-zinc-400 text-lg max-w-2xl">Descubre los mejores descuentos de la temporada. ¡Aprovecha antes de que se agoten!</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner border-t-rose-500" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-3xl">
          <FaTag className="mx-auto text-zinc-600 mb-4" size={48} />
          <h2 className="text-xl font-bold text-zinc-300">No hay promociones activas</h2>
          <p className="text-zinc-500">Vuelve pronto para ver nuevas ofertas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
