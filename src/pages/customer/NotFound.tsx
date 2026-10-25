import { Link } from 'react-router-dom';
import { WhatsAppIcon, SearchIcon } from '../../components/ui/Icons';
import { WHATSAPP_URL } from '../../lib/whatsapp';

export function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="stripe-accent opacity-30 rounded-2xl" />
      <p className="price-tag text-sigo-orange text-7xl md:text-8xl">404</p>
      <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase mt-2 mb-3">
        Página no encontrada
      </h1>
      <p className="text-sigo-muted text-lg mb-8">
        La página que buscas no existe o fue movida. Revisa la dirección o vuelve
        a la tienda para seguir buscando tu repuesto.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold px-8 py-3.5 rounded-xl transition-colors uppercase"
        >
          Ir al inicio
        </Link>
        <Link
          to="/catalog"
          className="flex items-center justify-center gap-2 border border-sigo-border text-sigo-light hover:text-white hover:border-sigo-muted px-8 py-3.5 rounded-xl transition-colors font-semibold"
        >
          <SearchIcon size={18} />
          Ver catálogo
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 px-8 py-3.5 rounded-xl transition-colors font-semibold"
        >
          <WhatsAppIcon size={18} />
          Escríbenos
        </a>
      </div>
    </div>
  );
}
