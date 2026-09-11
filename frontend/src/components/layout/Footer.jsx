import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebook, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGem } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <FaGem className="text-gold" size={24} />
              <span className="text-xl font-black gold-text">FashionStore</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5">
              Moda premium para toda la familia. Calidad, estilo y comodidad en cada prenda que ofrecemos.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaInstagram size={16} />, href: '#' },
                { icon: <FaFacebook size={16} />, href: '#' },
                { icon: <FaWhatsapp size={16} />, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/40 transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colecciones */}
          <div>
            <h3 className="text-sm font-bold text-gold uppercase tracking-widest mb-5">Colecciones</h3>
            <ul className="space-y-3">
              {[
                { label: 'Hombre', path: '/categoria/hombre' },
                { label: 'Mujer', path: '/categoria/mujer' },
                { label: 'Niños', path: '/categoria/ninos' },
                { label: 'Niñas', path: '/categoria/ninas' },
                { label: '🔥 Promociones', path: '/promociones' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-zinc-500 text-sm hover:text-zinc-200 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-sm font-bold text-gold uppercase tracking-widest mb-5">Ayuda</h3>
            <ul className="space-y-3">
              {['Guía de tallas', 'Envíos y devoluciones', 'Métodos de pago', 'Preguntas frecuentes', 'Política de privacidad'].map(item => (
                <li key={item}>
                  <span className="text-zinc-500 text-sm hover:text-zinc-200 transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-bold text-gold uppercase tracking-widest mb-5">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-zinc-500">
                <FaMapMarkerAlt className="text-gold mt-0.5 shrink-0" />
                <span>Av. Moda 123, Local 4<br />Ciudad Centro, CP 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500">
                <FaPhone className="text-gold shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500">
                <FaEnvelope className="text-gold shrink-0" />
                <span>hola@fashionstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">&copy; {new Date().getFullYear()} FashionStore. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 opacity-40" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-40" />
          </div>
        </div>
      </div>
    </footer>
  )
}
