import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Promociones from './pages/Promociones'

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('fs_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('fs_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, size, color) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size && i.color === color)
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, size, color, quantity: 1 }]
    })
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar cartCount={cartCount} />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:slug" element={<Category />} />
            <Route path="/producto/:id" element={<Product onAddToCart={addToCart} />} />
            <Route path="/carrito" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
            <Route path="/promociones" element={<Promociones />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
