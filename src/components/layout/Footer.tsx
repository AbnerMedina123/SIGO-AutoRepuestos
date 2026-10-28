import { Link } from 'react-router-dom';
import sigoLogo from '../../assets/sigo-logo.png';
import { WhatsAppIcon } from '../ui/Icons';
import { WHATSAPP_URL } from '../../lib/whatsapp';

const FACEBOOK_URL =
  'https://www.facebook.com/people/SI-GO/pfbid0hASQtr3egfTtquicKVYUSADzfCrFj1ps2GDaWJsGiSYH9Rh8Yhp9joKPd8Qs7XJQl/';

export function Footer() {
  return (
    <footer className="bg-sigo-dark border-t border-sigo-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src={sigoLogo} alt="SIGO Autorepuestos" className="h-16 w-auto mb-4" />
            <p className="text-sigo-muted text-sm leading-relaxed">
              Repuestos automotrices de calidad para vehículos livianos y pesados. La confianza de mecánicos y transportistas.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <WhatsAppIcon size={16} />
                WhatsApp
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-lg mb-4 tracking-wide">CATÁLOGO</h4>
            <ul className="space-y-2">
              {[
                { label: 'Partes de motor', to: '/catalog?category=engine' },
                { label: 'Sistemas de frenos', to: '/catalog?category=brakes' },
                { label: 'Suspensión', to: '/catalog?category=suspension' },
                { label: 'Transmisión', to: '/catalog?category=transmission' },
                { label: 'Sistema eléctrico', to: '/catalog?category=electrical' },
                { label: 'Filtros', to: '/catalog?category=filters' },
                { label: 'Lubricantes y aceites', to: '/catalog?category=lubricants' },
                { label: 'Repuestos para vehículos pesados', to: '/catalog?category=heavy-duty' },
                { label: 'Todas las categorías', to: '/catalog' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sigo-muted hover:text-sigo-orange text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-lg mb-4 tracking-wide">MI CUENTA</h4>
            <ul className="space-y-2">
              {[
                { label: 'Iniciar sesión', to: '/login' },
                { label: 'Crear cuenta', to: '/register' },
                { label: 'Mis pedidos', to: '/orders' },
                { label: 'Mi perfil', to: '/dashboard' },
                { label: 'Carrito de compras', to: '/cart' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sigo-muted hover:text-sigo-orange text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-lg mb-4 tracking-wide">CONTACTO</h4>
            <ul className="space-y-3 text-sm text-sigo-muted">
              <li>📍 SIGO Autorepuestos<br />Guatemala, Guatemala</li>
              <li>📞 +502 4575 2892</li>
              <li>✉️ info@sigoautorepuestos.com</li>
              <li>🕐 Lun–Vie 8:00–18:00<br />Sáb 8:00–13:00</li>
              <li>
                📘{' '}
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sigo-orange transition-colors"
                >
                  SI GO en Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sigo-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sigo-muted text-xs">
            © 2024 SIGO Autorepuestos · Liviano y Pesado. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-sigo-muted">
            <span>Pedidos coordinados por WhatsApp</span>
            <span>·</span>
            <Link to="/privacy" className="hover:text-sigo-orange">Política de privacidad</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-sigo-orange">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
