import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { FaSlidersH, FaSearch, FaTimes } from 'react-icons/fa'

const API = 'http://localhost:3000/api'

const META = {
  hombre: { label: 'Hombre', emoji: '👔', desc: 'La mejor ropa masculina, desde lo casual hasta lo formal.' },
  mujer: { label: 'Mujer', emoji: '👗', desc: 'Moda femenina sofisticada para cada ocasión.' },
  ninos: { label: 'Niños', emoji: '⚽', desc: 'Ropa resistente, cómoda y divertida para los más pequeños.' },
  ninas: { label: 'Niñas', emoji: '🎀', desc: 'Prendas coloridas y adorables para ellas.' },
}

const SORT_OPTIONS = [
  { value: 'default', label: 'Destacados' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  { value: 'rating', label: 'Mejor Valorados' },
]

export default function Category() {
  const { slug } = useParams()
  const meta = META[slug] || { label: slug, emoji: '👕', desc: '' }
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('default')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/products?category=${slug}`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return b.is_featured - a.is_featured
    })

  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Buscar en ${meta.label}...`}
              className="input-field pl-10 text-sm" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <FaTimes size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FaSlidersH className="text-zinc-500 shrink-0" size={14} />
            <select value={sort} onChange={e => setSort(e.target.value)} className="input-field py-2.5 text-sm w-auto min-w-[180px]">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <p className="text-zinc-500 text-sm mb-6">{filtered.length} productos encontrados</p>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-xl mb-2">No se encontraron productos</p>
            <button onClick={() => setSearch('')} className="text-gold hover:underline">Limpiar búsqueda</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
