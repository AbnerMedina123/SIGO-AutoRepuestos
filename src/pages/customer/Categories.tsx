import { Link } from 'react-router-dom';
import { useData } from '../../store/DataProvider';
import { imgFallback } from '../../lib/images';
import { WhatsAppIcon, ChevronRightIcon } from '../../components/ui/Icons';
import { WHATSAPP_URL } from '../../lib/whatsapp';
import { Loading, ErrorState } from '../../components/ui/DataState';

/**
 * Página dedicada a explorar las categorías (ruta /categories).
 * Muestra tarjetas grandes por categoría con imagen, descripción y el número
 * real de productos. Al hacer clic, lleva al catálogo filtrado por esa
 * categoría. Es un índice visual, distinto del catálogo de productos.
 */
export function Categories() {
  const { categories, products, loading, error, reloadCatalog } = useData();

  // Conteo real de productos por categoría (más fiable que el campo "count").
  const countFor = (categoryId: string) =>
    products.filter((p) => p.category === categoryId).length;

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-10"><Loading label="Cargando categorías..." /></div>;
  }
  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-10"><ErrorState message={error} onRetry={() => reloadCatalog()} /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-0.5 bg-sigo-orange" />
        <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.2em] uppercase">Explora el catálogo</span>
      </div>
      <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase mb-2">Categorías</h1>
      <p className="text-sigo-muted mb-8 max-w-2xl">
        Encuentra el repuesto que necesitas navegando por categoría. Elige una
        para ver todos sus productos disponibles.
      </p>

      {/* Tarjetas de categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const count = countFor(cat.id);
          return (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="card-hover group relative overflow-hidden rounded-2xl border border-sigo-border bg-sigo-card"
              style={{ height: 220 }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                onError={imgFallback}
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sigo-black via-sigo-black/60 to-transparent" />
              <div className="absolute top-0 left-0 w-1 h-0 bg-sigo-orange group-hover:h-full transition-all duration-300" />
              <div className="relative h-full flex flex-col justify-end p-5">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-display font-black text-white text-2xl uppercase leading-none">{cat.name}</h3>
                <p className="text-sigo-light text-sm mt-1 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sigo-orange text-sm font-semibold">
                    {count} {count === 1 ? 'repuesto' : 'repuestos'}
                  </span>
                  <span className="flex items-center gap-1 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver <ChevronRightIcon size={15} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-sigo-card border border-sigo-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">¿No encuentras tu categoría?</h2>
          <p className="text-sigo-muted text-sm mt-1">Escríbenos por WhatsApp y te ayudamos a localizar el repuesto exacto.</p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb356] text-white font-display font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
        >
          <WhatsAppIcon size={18} />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
