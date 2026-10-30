import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../store/DataProvider';
import { ProductCard } from '../../components/ui/ProductCard';
import { Badge, StockBadge } from '../../components/ui/Badge';
import { ShoppingCartIcon, PlusIcon, MinusIcon, WhatsAppIcon, CheckIcon, ChevronRightIcon, HeartIcon } from '../../components/ui/Icons';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { createWhatsAppUrl, formatCurrency } from '../../lib/whatsapp';
import { imgFallback } from '../../lib/images';
import { isFavorite, toggleFavorite, subscribeFavorites } from '../../lib/favorites';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const { products, loading } = useData();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<'desc' | 'specs' | 'warranty'>('desc');
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (!id) return;
    setFav(isFavorite(id));
    return subscribeFavorites(() => setFav(isFavorite(id)));
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-sigo-muted text-xl">Cargando producto...</p>
    </div>
  );

  if (!product) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-sigo-muted text-xl">Producto no encontrado.</p>
      <Link to="/catalog" className="text-sigo-orange mt-4 inline-block">← Volver al catálogo</Link>
    </div>
  );

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const price = product.salePrice ?? product.price;
  const outOfStock = product.status === 'OUT_OF_STOCK' || product.stock === 0;
  const stockStatus = product.stock === 0 ? 'OUT_OF_STOCK' : product.stock <= product.minStock ? 'LOW_STOCK' : 'IN_STOCK';

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const inquiryMessage = `Hola, quiero consultar información sobre este producto:

Producto: ${product.name}
Código: ${product.code}
Precio: ${formatCurrency(price)}

¿Podrían brindarme más información?`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-sigo-muted mb-6">
        <Link to="/" className="hover:text-white">Inicio</Link>
        <ChevronRightIcon size={14} />
        <Link to="/catalog" className="hover:text-white">Catálogo</Link>
        <ChevronRightIcon size={14} />
        <span className="text-sigo-light line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="bg-sigo-card border border-sigo-border rounded-xl overflow-hidden mb-3" style={{ height: 400 }}>
            <img src={product.images[activeImg] ?? product.image} alt={product.name} onError={imgFallback} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`border-2 rounded-lg overflow-hidden flex-shrink-0 ${activeImg === i ? 'border-sigo-orange' : 'border-sigo-border hover:border-sigo-muted'}`}
                style={{ width: 72, height: 72 }}
              >
                <img src={img} alt="" onError={imgFallback} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge status={product.status} />
            <StockBadge status={stockStatus} />
            <button
              onClick={() => toggleFavorite(product.id)}
              aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className={`ml-auto flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                fav
                  ? 'bg-sigo-orange/10 border-sigo-orange/40 text-sigo-orange'
                  : 'border-sigo-border text-sigo-light hover:text-sigo-orange hover:border-sigo-orange/40'
              }`}
            >
              <HeartIcon size={16} fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'En favoritos' : 'Favorito'}
            </button>
          </div>

          <h1 className="font-display font-black text-3xl md:text-4xl text-white leading-tight mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 text-sm text-sigo-muted mb-4">
            <span>Marca: <strong className="text-sigo-orange">{product.brand}</strong></span>
            <span>·</span>
            <span className="font-mono">{product.code}</span>
            <span>·</span>
            <span className="font-mono">{product.partNumber}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="price-tag text-4xl text-sigo-orange">{formatCurrency(price)}</span>
            {product.salePrice && (
              <>
                <span className="text-sigo-muted text-xl line-through">{formatCurrency(product.price)}</span>
                <span className="bg-sigo-orange/20 text-sigo-orange text-sm font-bold px-2 py-0.5 rounded font-display">
                  AHORRA {formatCurrency(product.price - product.salePrice)}
                </span>
              </>
            )}
          </div>

          {/* Compatibility */}
          <div className="bg-sigo-surface border border-sigo-border rounded-lg p-3 mb-5">
            <p className="text-xs text-sigo-muted font-semibold uppercase tracking-wider mb-1">Compatibilidad de vehículos</p>
            <ul className="space-y-0.5">
              {product.compatibility.map(c => (
                <li key={c} className="flex items-center gap-2 text-sm text-sigo-light">
                  <CheckIcon size={12} className="text-sigo-orange flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Stock */}
          <p className="text-sm text-sigo-muted mb-5">
            {outOfStock
              ? 'Agotado actualmente'
              : product.stock <= product.minStock
                ? `Solo quedan ${product.stock} unidades`
                : `${product.stock} unidades disponibles`
            }
          </p>

          {/* Quantity */}
          {!outOfStock && (
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center border border-sigo-border rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2.5 text-sigo-muted hover:text-white hover:bg-sigo-surface">
                  <MinusIcon size={16} />
                </button>
                <span className="px-4 text-white font-mono font-bold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="p-2.5 text-sigo-muted hover:text-white hover:bg-sigo-surface">
                  <PlusIcon size={16} />
                </button>
              </div>
              <span className="text-sigo-muted text-sm">Total: <strong className="text-sigo-orange">{formatCurrency(price * qty)}</strong></span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 font-display font-bold py-3.5 rounded-xl transition-all ${
                  added ? 'bg-green-600 text-white' : 'bg-sigo-orange hover:bg-sigo-orange-dark text-white'
                } disabled:bg-sigo-border disabled:text-sigo-muted`}
              >
                {added ? <><CheckIcon size={18} /> ¡Agregado!</> : <><ShoppingCartIcon size={18} /> Agregar al carrito</>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="flex-1 border-2 border-sigo-orange text-sigo-orange hover:bg-sigo-orange hover:text-white font-display font-bold py-3.5 rounded-xl transition-all disabled:border-sigo-border disabled:text-sigo-muted"
              >
                Comprar ahora
              </button>
            </div>
            <a
              href={createWhatsAppUrl(inquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/20 font-semibold py-3 rounded-xl transition-colors"
            >
              <WhatsAppIcon size={18} />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-sigo-border">
          {(['desc', 'specs', 'warranty'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-display font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
                tab === t ? 'border-sigo-orange text-sigo-orange' : 'border-transparent text-sigo-muted hover:text-white'
              }`}
            >
              {t === 'desc' ? 'Descripción' : t === 'specs' ? 'Especificaciones' : 'Garantía'}
            </button>
          ))}
        </div>

        <div className="py-6 bg-sigo-card border border-t-0 border-sigo-border rounded-b-xl px-6">
          {tab === 'desc' && (
            <p className="text-sigo-light leading-relaxed">{product.description}</p>
          )}
          {tab === 'specs' && (
            <table className="w-full max-w-lg">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k} className="border-b border-sigo-border last:border-0">
                    <td className="py-2.5 pr-8 text-sigo-muted text-sm font-semibold w-40">{k}</td>
                    <td className="py-2.5 text-white text-sm font-mono">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'warranty' && (
            <div className="flex items-start gap-3">
              <div className="text-3xl">🛡️</div>
              <div>
                <p className="text-white font-bold text-lg">{product.warranty}</p>
                <p className="text-sigo-muted text-sm mt-1">La garantía cubre defectos de fabricación bajo condiciones normales de uso. Contáctanos por WhatsApp o correo para gestionar cualquier reclamo.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display font-black text-3xl text-white uppercase mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
