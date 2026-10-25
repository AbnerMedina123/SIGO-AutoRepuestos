import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from '../../components/ui/Icons';
import { formatCurrency } from '../../lib/whatsapp';
import { imgFallback } from '../../lib/images';

export function Cart() {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useStore();
  const navigate = useNavigate();
  const shipping = cartTotal >= 200 ? 0 : 15;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingCartIcon size={64} className="text-sigo-border mx-auto mb-6" />
      <h2 className="font-display font-black text-4xl text-white mb-3">Tu carrito está vacío</h2>
      <p className="text-sigo-muted mb-8">Agrega los repuestos que necesitas para comenzar.</p>
      <Link to="/catalog" className="bg-sigo-orange text-white font-display font-bold px-8 py-3.5 rounded-xl">
        Ver catálogo
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display font-black text-4xl text-white uppercase mb-8">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => {
            const price = product.salePrice ?? product.price;
            return (
              <div key={product.id} className="bg-sigo-card border border-sigo-border rounded-xl p-4 flex gap-4">
                <img src={product.image} alt={product.name} onError={imgFallback} className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-sigo-surface" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`} className="font-display font-bold text-white hover:text-sigo-orange transition-colors line-clamp-2">
                    {product.name}
                  </Link>
                  <p className="text-sigo-muted text-xs font-mono mt-0.5">{product.code}</p>
                  <p className="text-sigo-muted text-xs">{product.brand}</p>
                  <p className="text-sigo-muted text-xs mt-1">Precio unitario: {formatCurrency(price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-sigo-border rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(product.id, quantity - 1)} className="p-1.5 text-sigo-muted hover:text-white hover:bg-sigo-surface">
                        <MinusIcon size={14} />
                      </button>
                      <span className="px-3 text-white font-mono text-sm">{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)} className="p-1.5 text-sigo-muted hover:text-white hover:bg-sigo-surface">
                        <PlusIcon size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="price-tag text-sigo-orange text-lg">{formatCurrency(price * quantity)}</div>
                        <div className="text-sigo-muted text-xs">Subtotal</div>
                      </div>
                      <button aria-label={`Eliminar ${product.name}`} title="Eliminar" onClick={() => removeFromCart(product.id)} className="text-sigo-muted hover:text-red-400 transition-colors p-1.5">
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-sigo-card border border-sigo-border rounded-xl p-6 sticky top-20">
            <h3 className="font-display font-bold text-xl text-white mb-5 uppercase">Resumen de tu compra</h3>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-sigo-muted">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos)</span>
                <span className="text-white">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sigo-muted">Envío</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                  {shipping === 0 ? 'Gratis' : formatCurrency(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-green-400">Envío gratis en compras mayores a Q200.00</p>
              )}
              <div className="border-t border-sigo-border pt-3 flex justify-between">
                <span className="font-display font-bold text-white text-lg">Total</span>
                <span className="price-tag text-sigo-orange text-2xl">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold py-3.5 rounded-xl transition-colors text-lg mb-3"
            >
              Continuar con datos de envío
            </button>
            <Link to="/catalog" className="block text-center text-sigo-muted hover:text-white text-sm transition-colors py-2">
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
