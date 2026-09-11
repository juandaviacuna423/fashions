import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaBars, FaTimes, FaSearch, FaGem } from 'react-icons/fa'

export default function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchVal.trim())}`)
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  const categories = [
    { label: 'Hombre', path: '/categoria/hombre' },
    { label: 'Mujer', path: '/categoria/mujer' },
    { label: 'Niños', path: '/categoria/ninos' },
    { label: 'Niñas', path: '/categoria/ninas' },
  ]

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl shadow-xl shadow-black/50 border-b border-zinc-900' : 'bg-black/60 backdrop-blur-sm border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setMenuOpen(false)}>
            <FaGem className="text-gold group-hover:scale-110 transition-transform duration-300" size={26} />
            <span className="text-xl font-black gold-text tracking-tighter hidden sm:block">FashionStore</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {categories.map(c => (
              <Link key={c.path} to={c.path}
                className="text-zinc-400 text-sm font-semibold uppercase tracking-widest hover:text-gold transition-colors">
                {c.label}
              </Link>
            ))}
            <Link to="/promociones" className="text-rose-400 text-sm font-bold uppercase tracking-widest hover:text-rose-300 transition-colors animate-pulse">
              🔥 Ofertas
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex gap-2 items-center">
                <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Buscar..." className="input-field text-sm py-2 w-40 sm:w-56" />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-zinc-500 hover:text-white transition-colors p-1">
                  <FaTimes />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-zinc-400 hover:text-gold transition-colors p-2">
                <FaSearch size={16} />
              </button>
            )}

            <Link to="/carrito" className="relative p-2 text-zinc-400 hover:text-gold transition-colors">
              <FaShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-gold to-gold-light text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors">
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-900 animate-fade-up">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
            {categories.map(c => (
              <Link key={c.path} to={c.path} onClick={() => setMenuOpen(false)}
                className="flex items-center py-3 px-2 text-zinc-300 font-semibold uppercase tracking-widest text-sm hover:text-gold border-b border-zinc-900 transition-colors">
                {c.label}
              </Link>
            ))}
            <Link to="/promociones" onClick={() => setMenuOpen(false)}
              className="flex items-center py-3 px-2 text-rose-400 font-bold uppercase tracking-widest text-sm hover:text-rose-300 transition-colors">
              🔥 Ofertas Especiales
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
