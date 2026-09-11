import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaLock, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaArrowLeft } from 'react-icons/fa'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const STEPS = ['Datos', 'Pago', 'Confirmación']

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '' })
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})

  const subtotal = cart.reduce((acc, i) => acc + ((i.sale_price || i.price) * i.quantity), 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const total = subtotal + shipping

  const validateStep0 = () => {
    const errs = {}
    if (!customer.name.trim()) errs.name = 'Nombre requerido'
    if (!customer.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = 'Email inválido'
    if (!customer.phone.trim()) errs.phone = 'Teléfono requerido'
    if (!customer.address.trim()) errs.address = 'Dirección requerida'
    if (!customer.city.trim()) errs.city = 'Ciudad requerida'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep1 = () => {
    if (paymentMethod !== 'card') return true
    const errs = {}
    if (card.number.replace(/\s/g, '').length < 16) errs.cardNumber = 'Número inválido'
    if (!card.name.trim()) errs.cardName = 'Nombre requerido'
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = 'Formato MM/YY'
    if (card.cvv.length < 3) errs.cvv = 'CVV inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1) {
      if (!validateStep1()) return
      submitOrder()
      return
    }
    setStep(s => s + 1)
  }

  const submitOrder = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { ...customer, address: `${customer.address}, ${customer.city} ${customer.zip}` },
          items: cart.map(i => ({ id: i.id, name: i.name, price: i.sale_price || i.price, quantity: i.quantity, size: i.size, color: i.color })),
          subtotal, shipping, total, payment_method: paymentMethod
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrder(data)
      setCart([])
      setStep(2)
    } catch (err) {
      alert('Error al procesar el pago. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => { const clean = v.replace(/\D/g, '').slice(0, 4); return clean.length >= 3 ? `${clean.slice(0,2)}/${clean.slice(2)}` : clean }

  if (cart.length === 0 && step !== 2) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-black mb-4">Tu carrito está vacío</h2>
        <Link to="/" className="btn-gold">Ir a la Tienda</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all ${
              i < step ? 'bg-emerald-500 text-white' :
              i === step ? 'bg-gradient-to-br from-gold to-gold-light text-black' :
              'bg-zinc-800 text-zinc-500'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`mx-2 text-sm font-semibold hidden sm:block ${i === step ? 'text-gold' : 'text-zinc-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-10 sm:w-16 mx-2 rounded-full ${i < step ? 'bg-emerald-500' : 'bg-zinc-800'}`} />}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Customer Info ──────────────────────────────────────── */}
      {step === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-black mb-6">Datos de Envío</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Nombre completo *</label>
                <input value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                  placeholder="Juan Pérez" className={`input-field ${errors.name ? 'border-rose-500' : ''}`} />
                {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Email *</label>
                <input type="email" value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))}
                  placeholder="tu@email.com" className={`input-field ${errors.email ? 'border-rose-500' : ''}`} />
                {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Teléfono *</label>
                <input value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                  placeholder="+1 555 123 4567" className={`input-field ${errors.phone ? 'border-rose-500' : ''}`} />
                {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Dirección *</label>
                <input value={customer.address} onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))}
                  placeholder="Calle 123, Apto 4B" className={`input-field ${errors.address ? 'border-rose-500' : ''}`} />
                {errors.address && <p className="text-rose-400 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Ciudad *</label>
                <input value={customer.city} onChange={e => setCustomer(c => ({ ...c, city: e.target.value }))}
                  placeholder="Ciudad" className={`input-field ${errors.city ? 'border-rose-500' : ''}`} />
                {errors.city && <p className="text-rose-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Código Postal</label>
                <input value={customer.zip} onChange={e => setCustomer(c => ({ ...c, zip: e.target.value }))}
                  placeholder="10001" className="input-field" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Link to="/carrito" className="btn-dark flex items-center gap-2"><FaArrowLeft size={12} /> Volver</Link>
              <button onClick={handleNext} className="btn-gold flex-1">Continuar al Pago <FaArrowLeft className="rotate-180" size={12} /></button>
            </div>
          </div>
          <OrderSummary cart={cart} subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      )}

      {/* ── STEP 1: Payment ───────────────────────────────────────────── */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-black mb-6">Método de Pago</h2>

            {/* Payment method tabs */}
            <div className="flex gap-3 mb-7">
              {[
                { id: 'card', label: 'Tarjeta', icon: <FaCreditCard /> },
                { id: 'cash', label: 'Efectivo', icon: <FaMoneyBillWave /> },
              ].map(m => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition-all ${paymentMethod === m.id ? 'border-gold bg-gold/10 text-gold' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-4">
                {/* Card preview */}
                <div className="rounded-2xl p-5 mb-2" style={{ background: 'linear-gradient(135deg, #c8a96e, #7a5f2e)' }}>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-black/60 text-sm font-bold">FashionStore</span>
                    <FaCreditCard className="text-black/60" size={28} />
                  </div>
                  <p className="text-black font-mono text-lg tracking-[3px] mb-4">
                    {(card.number || '•••• •••• •••• ••••')}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/70">{card.name || 'NOMBRE DEL TITULAR'}</span>
                    <span className="text-black/70">{card.expiry || 'MM/YY'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Número de Tarjeta *</label>
                  <input value={card.number} onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    className={`input-field font-mono tracking-widest ${errors.cardNumber ? 'border-rose-500' : ''}`} />
                  {errors.cardNumber && <p className="text-rose-400 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Nombre del Titular *</label>
                  <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                    placeholder="JUAN PÉREZ" className={`input-field ${errors.cardName ? 'border-rose-500' : ''}`} />
                  {errors.cardName && <p className="text-rose-400 text-xs mt-1">{errors.cardName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-400 mb-1.5">Vencimiento *</label>
                    <input value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY" maxLength={5}
                      className={`input-field ${errors.expiry ? 'border-rose-500' : ''}`} />
                    {errors.expiry && <p className="text-rose-400 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-400 mb-1.5">CVV *</label>
                    <input value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="•••" maxLength={4}
                      className={`input-field ${errors.cvv ? 'border-rose-500' : ''}`} />
                    {errors.cvv && <p className="text-rose-400 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-xl p-6 text-center text-zinc-400">
                <FaMoneyBillWave className="mx-auto text-gold mb-3" size={36} />
                <p className="font-semibold mb-2">Pago en efectivo al recibir</p>
                <p className="text-sm">El repartidor llevará tu pedido. Ten el monto exacto listo.</p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button onClick={() => { setStep(0); setErrors({}) }} className="btn-dark flex items-center gap-2">
                <FaArrowLeft size={12} /> Volver
              </button>
              <button onClick={handleNext} disabled={loading}
                className={`btn-gold flex-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                    </svg>
                    Procesando…
                  </span>
                ) : (
                  <><FaLock size={13} /> Confirmar Pago • ${total.toFixed(2)}</>
                )}
              </button>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-zinc-600 text-xs mt-4">
              <FaLock size={10} /> Pago seguro con encriptación SSL 256-bit
            </p>
          </div>
          <OrderSummary cart={cart} subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      )}

      {/* ── STEP 2: Confirmation ──────────────────────────────────────── */}
      {step === 2 && order && (
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12">
            <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-emerald-400" size={36} />
            </div>
            <h2 className="text-2xl font-black mb-2">¡Pedido Confirmado!</h2>
            <p className="text-zinc-400 mb-6">Tu pedido fue procesado exitosamente. Recibirás un email de confirmación pronto.</p>

            <div className="bg-zinc-800 rounded-2xl p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400 text-sm">N° de Orden</span>
                <span className="font-black text-gold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 text-sm">Email</span>
                <span className="text-sm font-semibold">{customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 text-sm">Total Pagado</span>
                <span className="font-black text-lg">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 text-sm">Entrega estimada</span>
                <span className="text-sm font-semibold">3-5 días hábiles</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/" className="btn-gold w-full">Seguir Comprando</Link>
              <Link to="/categoria/mujer" className="btn-outline w-full">Ver Nuevas Colecciones</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrderSummary({ cart, subtotal, shipping, total }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-fit sticky top-28">
      <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-zinc-400">Resumen del Pedido</h3>
      <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
        {cart.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <p className="text-xs text-zinc-500">{item.size && `Talla ${item.size}`} x{item.quantity}</p>
            </div>
            <span className="text-sm font-bold shrink-0">${((item.sale_price || item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-zinc-400">
          <span>Envío</span>
          <span className={shipping === 0 ? 'text-emerald-400' : ''}>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-black text-base pt-2 border-t border-zinc-800">
          <span>Total</span>
          <span className="gold-text">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
