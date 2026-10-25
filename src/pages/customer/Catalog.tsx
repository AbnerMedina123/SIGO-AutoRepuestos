import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useData } from '../../store/DataProvider';
import { ProductCard } from '../../components/ui/ProductCard';
import { SearchIcon, FilterIcon, GridIcon, ListIcon } from '../../components/ui/Icons';
import { Loading, ErrorState } from '../../components/ui/DataState';

const statuses = ['NEW', 'SALE', 'POPULAR', 'LOW_STOCK', 'OUT_OF_STOCK'];

export function Catalog() {
  const { products, categories, loading, error, reloadCatalog } = useData();
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products]);
  const [params] = useSearchParams();
  const location = useLocation();
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [brand, setBrand] = useState('');
  const [priceMax, setPriceMax] = useState(1000);
  const [sortBy, setSortBy] = useState('popular');
  const [filterStatus, setFilterStatus] = useState(params.get('filter') === 'sale' ? 'SALE' : '');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mantiene los filtros sincronizados con la URL. Así, al navegar desde el
  // menú (p. ej. "Ofertas" -> ?filter=sale o una búsqueda -> ?q=...) estando
  // ya en /catalog, la vista se actualiza sin necesidad de remontar la página.
  useEffect(() => {
    setSearch(params.get('q') ?? '');
    setCategory(params.get('category') ?? '');
    setFilterStatus(params.get('filter') === 'sale' ? 'SALE' : '');
  }, [params]);

  // Desplaza suavemente a la sección de categorías cuando el enlace trae el
  // ancla #categorias (menú "Categorías").
  useEffect(() => {
    if (location.hash === '#categorias') {
      const el = document.getElementById('categorias');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.compatibility.some(c => c.toLowerCase().includes(q))
      );
    }
    if (category) list = list.filter(p => p.category === category);
    if (brand) list = list.filter(p => p.brand === brand);
    if (filterStatus) list = list.filter(p => p.status === filterStatus);
    list = list.filter(p => (p.salePrice ?? p.price) <= priceMax);
    if (sortBy === 'price-asc') list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    else if (sortBy === 'price-desc') list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    else if (sortBy === 'newest') list.sort((a, b) => (b.status === 'NEW' ? 1 : 0) - (a.status === 'NEW' ? 1 : 0));
    return list;
  }, [products, search, category, brand, filterStatus, priceMax, sortBy]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><Loading label="Cargando catálogo..." /></div>;
  }
  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><ErrorState message={error} onRetry={() => reloadCatalog()} /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display font-black text-4xl text-white uppercase">Catálogo de repuestos</h1>
        <p className="text-sigo-muted mt-1">{filtered.length} productos encontrados</p>
      </div>

      {/* Category quick access (target of the "Categorías" menu anchor) */}
      <section id="categorias" className="scroll-mt-24 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-0.5 bg-sigo-orange" />
          <h2 className="text-sigo-orange font-display text-sm font-bold tracking-[0.15em] uppercase">Explora por categoría</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setCategory('')}
            className={`relative overflow-hidden rounded-xl border p-3 text-left transition-colors ${
              !category ? 'border-sigo-orange bg-sigo-orange/10' : 'border-sigo-border bg-sigo-card hover:border-sigo-orange/40'
            }`}
          >
            <div className="text-2xl mb-1">🧰</div>
            <div className="font-display font-bold text-white text-sm leading-tight">Todas</div>
            <div className="text-sigo-muted text-xs mt-0.5">{products.length} repuestos</div>
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? '' : c.id)}
              className={`relative overflow-hidden rounded-xl border p-3 text-left transition-colors ${
                category === c.id ? 'border-sigo-orange bg-sigo-orange/10' : 'border-sigo-border bg-sigo-card hover:border-sigo-orange/40'
              }`}
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="font-display font-bold text-white text-sm leading-tight line-clamp-1">{c.name}</div>
              <div className="text-sigo-orange text-xs font-semibold mt-0.5">{c.count} repuestos</div>
            </button>
          ))}
        </div>
      </section>

      {/* Search + controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sigo-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, marca, código o vehículo..."
            className="w-full bg-sigo-surface border border-sigo-border text-white placeholder-sigo-muted pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange"
          />
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-sigo-surface border border-sigo-border text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange"
        >
          <option value="popular">Ordenar: populares</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="newest">Más recientes</option>
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-sigo-surface border border-sigo-border text-sigo-light hover:text-white px-4 py-2.5 rounded-lg transition-colors md:hidden"
        >
          <FilterIcon size={16} /> Filtros
        </button>

        <div className="flex gap-1 border border-sigo-border rounded-lg overflow-hidden">
          <button onClick={() => setView('grid')} className={`p-2.5 ${view === 'grid' ? 'bg-sigo-orange text-white' : 'bg-sigo-surface text-sigo-muted hover:text-white'}`}>
            <GridIcon size={18} />
          </button>
          <button onClick={() => setView('list')} className={`p-2.5 ${view === 'list' ? 'bg-sigo-orange text-white' : 'bg-sigo-surface text-sigo-muted hover:text-white'}`}>
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0`}>
          <div className="bg-sigo-card border border-sigo-border rounded-xl p-4 space-y-5 sticky top-20">
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-2">Categoría</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory('')}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded ${!category ? 'text-sigo-orange font-semibold' : 'text-sigo-muted hover:text-white'}`}
                >
                  Todas las categorías
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(category === c.id ? '' : c.id)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded flex justify-between ${category === c.id ? 'text-sigo-orange font-semibold bg-sigo-orange/10' : 'text-sigo-muted hover:text-white'}`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-sigo-border pt-4">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-2">Marca</h4>
              <select
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-sigo-surface border border-sigo-border text-white text-sm px-2 py-2 rounded focus:outline-none focus:border-sigo-orange"
              >
                <option value="">Todas las marcas</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="border-t border-sigo-border pt-4">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-2">
                Precio máximo: <span className="text-sigo-orange">Q{priceMax}</span>
              </h4>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-sigo-muted mt-1">
                <span>Q10</span><span>Q1,000</span>
              </div>
            </div>

            <div className="border-t border-sigo-border pt-4">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-2">Estado</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setFilterStatus('')}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded ${!filterStatus ? 'text-sigo-orange font-semibold' : 'text-sigo-muted hover:text-white'}`}
                >
                  Todos
                </button>
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded ${filterStatus === s ? 'text-sigo-orange font-semibold bg-sigo-orange/10' : 'text-sigo-muted hover:text-white'}`}
                  >
                    {({ NEW: 'Nuevo', SALE: 'Oferta', POPULAR: 'Popular', LOW_STOCK: 'Pocas unidades', OUT_OF_STOCK: 'Agotado' } as Record<string, string>)[s]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setSearch(''); setCategory(''); setBrand(''); setPriceMax(1000); setFilterStatus(''); }}
              className="w-full border border-sigo-border text-sigo-muted hover:text-white text-sm py-2 rounded transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-sigo-muted">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl font-display font-bold text-white">No encontramos productos</p>
              <p className="mt-2">Prueba con otra búsqueda o ajusta los filtros.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
