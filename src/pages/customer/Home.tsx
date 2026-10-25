import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../store/DataProvider';
import { ProductCard } from '../../components/ui/ProductCard';
import { SearchIcon, ChevronRightIcon, WhatsAppIcon } from '../../components/ui/Icons';
import { WHATSAPP_URL } from '../../lib/whatsapp';
import { imgFallback } from '../../lib/images';

export function Home() {
  const { products, categories } = useData();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalog?q=${encodeURIComponent(search.trim())}`);
  };

  const featured = products.filter(p => ['POPULAR', 'NEW', 'SALE'].includes(p.status)).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1400&h=900&fit=crop&auto=format')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sigo-black via-sigo-black/85 to-sigo-black/30" />
        <div className="absolute inset-0 stripe-accent opacity-40" />

        {/* Orange accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sigo-orange" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-sigo-orange" />
              <span className="text-sigo-orange font-display font-bold text-sm tracking-[0.2em] uppercase">Liviano y Pesado</span>
            </div>

            <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-[0.9] mb-6 uppercase">
              Todo lo que tu<br />
              <span className="text-gradient">vehículo necesita</span><br />
              en un solo lugar
            </h1>

            <p className="text-sigo-light text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
              Repuestos de calidad para vehículos livianos y pesados, con atención confiable en toda Guatemala.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg">
              <div className="relative flex-1">
                <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sigo-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="¿Qué repuesto estás buscando?"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-sigo-muted pl-10 pr-4 py-3.5 rounded-lg focus:outline-none focus:border-sigo-orange transition-colors"
                />
              </div>
              <button type="submit" className="bg-sigo-orange hover:bg-sigo-orange-dark text-white font-bold px-6 py-3.5 rounded-lg transition-colors whitespace-nowrap">
                Buscar
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold text-lg px-8 py-3.5 rounded-lg transition-colors uppercase tracking-wide"
              >
                Comprar ahora
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold px-6 py-3.5 rounded-lg transition-all"
              >
                <WhatsAppIcon size={20} />
                Contactar por WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { v: '5,000+', l: 'Productos' },
                { v: '200+', l: 'Marcas' },
                { v: '10K+', l: 'Clientes' },
              ].map(s => (
                <div key={s.l}>
                  <div className="price-tag text-sigo-orange text-3xl">{s.v}</div>
                  <div className="text-sigo-muted text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category quick links */}
      <section className="bg-sigo-surface border-y border-sigo-border py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-sigo-light hover:text-white hover:bg-sigo-card rounded-lg transition-colors"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-0.5 bg-sigo-orange" />
              <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.15em] uppercase">Explora por</span>
            </div>
            <h2 className="font-display font-black text-4xl text-white uppercase">Categorías</h2>
          </div>
          <Link to="/catalog" className="flex items-center gap-1 text-sigo-orange hover:text-sigo-orange-light text-sm font-semibold">
            Ver todas <ChevronRightIcon size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="card-hover group relative overflow-hidden rounded-xl border border-sigo-border bg-sigo-card"
              style={{ height: 180 }}
            >
              <img src={cat.image} alt={cat.name} onError={imgFallback} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-sigo-black via-sigo-black/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-2xl mb-1">{cat.icon}</div>
                <h3 className="font-display font-bold text-white text-lg leading-tight">{cat.name}</h3>
                <p className="text-sigo-muted text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                <div className="text-sigo-orange text-xs font-semibold mt-1">{cat.count} repuestos</div>
              </div>
              <div className="absolute top-0 left-0 w-0.5 h-0 bg-sigo-orange group-hover:h-full transition-all duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-sigo-surface border-y border-sigo-border py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-0.5 bg-sigo-orange" />
              <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.15em] uppercase">Selección especial</span>
              </div>
              <h2 className="font-display font-black text-4xl text-white uppercase">Productos destacados</h2>
            </div>
            <Link to="/catalog" className="flex items-center gap-1 text-sigo-orange hover:text-sigo-orange-light text-sm font-semibold">
              Ver todos <ChevronRightIcon size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Why Choose SIGO */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-sigo-orange" />
            <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.15em] uppercase">Por qué SIGO</span>
            <div className="w-8 h-0.5 bg-sigo-orange" />
          </div>
          <h2 className="font-display font-black text-4xl text-white uppercase">La diferencia SIGO</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔧', title: 'Calidad OEM', desc: 'Cada repuesto cumple o supera las especificaciones del fabricante original.' },
            { icon: '🚀', title: 'Entrega rápida', desc: 'Despacho ágil de productos disponibles y cobertura en Guatemala.' },
            { icon: '🛡️', title: 'Garantía incluida', desc: 'Garantías confiables en las principales categorías de repuestos.' },
            { icon: '💬', title: 'Atención experta', desc: 'Nuestro equipo de especialistas está listo para asesorarte.' },
          ].map(item => (
            <div key={item.title} className="bg-sigo-card border border-sigo-border rounded-xl p-6 hover:border-sigo-orange/40 transition-colors group">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-display font-bold text-xl text-white mb-2">{item.title}</h3>
              <p className="text-sigo-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-sigo-orange mx-4 mb-16 rounded-2xl">
        <div className="absolute inset-0 stripe-accent opacity-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-black text-4xl text-white uppercase leading-tight">
              ¿No encuentras tu repuesto?
            </h2>
            <p className="text-orange-100 mt-2">Escríbenos y te ayudaremos a encontrarlo, para vehículo liviano o pesado.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white text-sigo-orange font-display font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap uppercase"
          >
            <WhatsAppIcon size={22} />
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
