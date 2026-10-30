import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, EyeIcon, HeartIcon } from './Icons';
import { Badge } from './Badge';
import type { Product } from '../../data/mockData';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/whatsapp';
import { imgFallback } from '../../lib/images';
import { isFavorite, toggleFavorite, subscribeFavorites } from '../../lib/favorites';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const price = product.salePrice ?? product.price;
  const outOfStock = product.status === 'OUT_OF_STOCK' || product.stock === 0;

  const [fav, setFav] = useState(() => isFavorite(product.id));
  useEffect(() => subscribeFavorites(() => setFav(isFavorite(product.id))), [product.id]);

  return (
    <div className="card-hover bg-sigo-card border border-sigo-border rounded-lg overflow-hidden flex flex-col group">
      <div className="relative overflow-hidden bg-sigo-surface" style={{ height: 200 }}>
        <img
          src={product.image}
          alt={product.name}
          onError={imgFallback}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-400 font-display font-bold text-lg tracking-widest">AGOTADO</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge status={product.status} />
        </div>

        {/* Botón de favorito */}
        <button
          onClick={() => toggleFavorite(product.id)}
          aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`absolute top-2 right-2 rounded-full p-1.5 transition-colors backdrop-blur-sm ${
            fav ? 'bg-sigo-orange/90 text-white' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <HeartIcon size={16} fill={fav ? 'currentColor' : 'none'} />
        </button>

        {product.salePrice && (
          <div className="absolute top-12 right-2 bg-sigo-orange text-white text-xs font-bold px-2 py-0.5 rounded font-display">
            -{Math.round((1 - product.salePrice / product.price) * 100)}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-sigo-muted text-xs font-mono">{product.brand} · {product.code}</p>
          <h3 className="text-white font-display font-bold text-base leading-snug mt-0.5 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <p className="text-sigo-muted text-xs line-clamp-1">
          {product.compatibility[0]}
        </p>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="price-tag text-sigo-orange text-xl">{formatCurrency(price)}</span>
          {product.salePrice && (
            <span className="text-sigo-muted text-sm line-through">{formatCurrency(product.price)}</span>
          )}
        </div>

        <div className="flex gap-2 mt-1">
          <button
            onClick={() => !outOfStock && addToCart(product)}
            disabled={outOfStock}
            className="flex-1 flex items-center justify-center gap-2 bg-sigo-orange hover:bg-sigo-orange-dark disabled:bg-sigo-border disabled:text-sigo-muted text-white text-sm font-bold py-2 rounded transition-colors"
          >
            <ShoppingCartIcon size={14} />
            Agregar al carrito
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex items-center justify-center gap-1 border border-sigo-border hover:border-sigo-orange text-sigo-light hover:text-sigo-orange text-sm px-3 py-2 rounded transition-colors"
          >
            <EyeIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
