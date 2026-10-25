import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { CheckIcon, WhatsAppIcon } from '../../components/ui/Icons';
import {
  createOrderMessage,
  createWhatsAppUrl,
  formatCurrency,
  type ShippingInfo,
} from '../../lib/whatsapp';
import { createOrder } from '../../lib/api';

type Step = 'shipping' | 'review';

const initialInfo: ShippingInfo = {
  fullName: '',
  phone: '',
  email: '',
  department: '',
  municipality: '',
  address: '',
  zone: '',
  reference: '',
  comments: '',
};

export function Checkout() {
  const { cartItems, cartTotal, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('shipping');
  const [error, setError] = useState('');
  const [info, setInfo] = useState<ShippingInfo>({
    ...initialInfo,
    email: user?.email ?? '',
    fullName: user?.name ?? '',
  });
  const shipping = cartTotal >= 200 ? 0 : 15;
  const total = cartTotal + shipping;

  const update = (field: keyof ShippingInfo, value: string) =>
    setInfo(current => ({ ...current, [field]: value }));

  const reviewOrder = (event: React.FormEvent) => {
    event.preventDefault();
    const required = [
      info.fullName,
      info.phone,
      info.email,
      info.department,
      info.municipality,
      info.address,
    ];
    if (required.some(value => !value.trim())) {
      setError('Completa todos los campos obligatorios para continuar.');
      return;
    }
    setError('');
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishOrder = async () => {
    const message = createOrderMessage(info, cartItems, cartTotal, shipping);
    const whatsappUrl = createWhatsAppUrl(message);
    const items = [...cartItems];
    const orderId = `ORD-${Date.now()}`;

    // Guarda el pedido en la base de datos para que aparezca en el panel admin.
    // Si falla (p. ej. sin conexión), igual continuamos con WhatsApp para no
    // bloquear la venta: el pedido siempre puede confirmarse por ese canal.
    try {
      await createOrder({
        id: orderId,
        customerName: info.fullName,
        subtotal: cartTotal,
        discount: 0,
        shipping,
        total,
        paymentMethod: 'Pedido por WhatsApp',
        deliveryMethod: 'Entrega a domicilio',
        address: `${info.address}, ${info.zone ? info.zone + ', ' : ''}${info.municipality}, ${info.department}`,
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          quantity,
          unitPrice: product.salePrice ?? product.price,
        })),
      });
    } catch (e) {
      console.error('No se pudo guardar el pedido en la base de datos:', e);
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    clearCart();
    navigate('/order-confirmation', {
      state: { whatsappUrl, total, items },
    });
  };

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-black text-4xl text-white uppercase mb-8">
        Finalizar compra
      </h1>

      <div className="flex items-center mb-10 max-w-xl">
        {[
          { id: 'shipping', label: 'Datos de envío' },
          { id: 'review', label: 'Revisar pedido' },
        ].map((item, index) => {
          const active = step === item.id;
          const completed = step === 'review' && item.id === 'shipping';
          return (
            <div key={item.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold transition-all ${
                    active || completed
                      ? 'bg-sigo-orange text-white ring-4 ring-sigo-orange/20'
                      : 'bg-sigo-surface border border-sigo-border text-sigo-muted'
                  }`}
                >
                  {completed ? <CheckIcon size={15} /> : index + 1}
                </div>
                <span className={`text-xs mt-2 whitespace-nowrap ${active || completed ? 'text-white' : 'text-sigo-muted'}`}>
                  {item.label}
                </span>
              </div>
              {index === 0 && <div className={`h-0.5 flex-1 mx-3 mb-5 ${completed ? 'bg-sigo-orange' : 'bg-sigo-border'}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'shipping' ? (
            <form onSubmit={reviewOrder} className="bg-sigo-card border border-sigo-border rounded-xl p-5 md:p-6">
              <h2 className="font-display font-bold text-2xl text-white uppercase mb-1">Datos de envío</h2>
              <p className="text-sigo-muted text-sm mb-6">Ingresa la información necesaria para coordinar la entrega en Guatemala.</p>

              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nombre completo *" value={info.fullName} onChange={value => update('fullName', value)} placeholder="Ej. Carlos Mendoza" />
                <Field label="Teléfono *" value={info.phone} onChange={value => update('phone', value)} placeholder="Ej. 4575 2892" type="tel" prefix="+502" />
                <Field label="Correo electrónico *" value={info.email} onChange={value => update('email', value)} placeholder="correo@ejemplo.com" type="email" />
                <Field label="Departamento *" value={info.department} onChange={value => update('department', value)} placeholder="Ej. Guatemala" />
                <Field label="Municipio *" value={info.municipality} onChange={value => update('municipality', value)} placeholder="Ej. Mixco" />
                <Field label="Zona" value={info.zone} onChange={value => update('zone', value)} placeholder="Ej. Zona 4" />
                <div className="md:col-span-2">
                  <Field label="Dirección de envío *" value={info.address} onChange={value => update('address', value)} placeholder="Colonia, calle, avenida y número de casa" />
                </div>
                <div className="md:col-span-2">
                  <Field label="Referencia de dirección" value={info.reference} onChange={value => update('reference', value)} placeholder="Ej. Portón negro frente a la farmacia" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">Comentarios adicionales</label>
                  <textarea
                    value={info.comments}
                    onChange={event => update('comments', event.target.value)}
                    className="input-sigo min-h-24 resize-y"
                    placeholder="Indicaciones especiales para tu pedido o entrega"
                  />
                </div>
              </div>

              <button type="submit" className="w-full md:w-auto mt-6 bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold px-8 py-3.5 rounded-xl transition-colors text-lg">
                Revisar pedido
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="bg-sigo-card border border-sigo-border rounded-xl p-5 md:p-6">
                <h2 className="font-display font-bold text-2xl text-white uppercase mb-6">Revisa tu pedido</h2>

                <ReviewSection title="Información del cliente">
                  <ReviewRow label="Nombre" value={info.fullName} />
                  <ReviewRow label="Teléfono" value={`+502 ${info.phone}`} />
                  <ReviewRow label="Correo" value={info.email} />
                </ReviewSection>

                <ReviewSection title="Datos de envío">
                  <ReviewRow label="Departamento" value={info.department} />
                  <ReviewRow label="Municipio" value={info.municipality} />
                  <ReviewRow label="Dirección" value={info.address} />
                  <ReviewRow label="Zona" value={info.zone || 'No indicada'} />
                  <ReviewRow label="Referencia" value={info.reference || 'No indicada'} />
                  <ReviewRow label="Comentarios" value={info.comments || 'Sin comentarios'} />
                </ReviewSection>

                <ReviewSection title="Productos">
                  <div className="space-y-3">
                    {cartItems.map(({ product, quantity }) => {
                      const price = product.salePrice ?? product.price;
                      return (
                        <div key={product.id} className="grid grid-cols-[1fr_auto] gap-3 py-3 border-b border-sigo-border last:border-0">
                          <div>
                            <p className="text-white font-semibold">{product.name}</p>
                            <p className="text-sigo-muted text-xs">Código: {product.code} · Cantidad: {quantity}</p>
                            <p className="text-sigo-muted text-xs">Precio unitario: {formatCurrency(price)}</p>
                          </div>
                          <span className="price-tag text-sigo-orange self-center">{formatCurrency(price * quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                </ReviewSection>

                <button
                  onClick={finishOrder}
                  className="w-full flex items-center justify-center gap-2 bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-black py-4 rounded-xl transition-colors text-lg uppercase"
                >
                  <WhatsAppIcon size={20} />
                  Finalizar compra
                </button>
                <button onClick={() => setStep('shipping')} className="w-full text-sigo-muted hover:text-white py-3 mt-1 transition-colors">
                  Volver a datos de envío
                </button>
                <button onClick={() => navigate('/cart')} className="w-full text-sigo-muted hover:text-white py-2 transition-colors">
                  Volver al carrito
                </button>
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="bg-sigo-card border border-sigo-border rounded-xl p-5 sticky top-24">
            <h3 className="font-display font-bold text-white uppercase mb-4">Resumen del pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-sigo-muted">Productos ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span><span className="text-white">{formatCurrency(cartTotal)}</span></div>
              <div className="flex justify-between"><span className="text-sigo-muted">Envío</span><span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span></div>
              <div className="flex justify-between border-t border-sigo-border pt-3">
                <span className="font-bold text-white">Total</span>
                <span className="price-tag text-sigo-orange text-xl">{formatCurrency(total)}</span>
              </div>
            </div>
            <p className="text-sigo-muted text-xs mt-5 leading-relaxed">
              No realizarás ningún pago en línea. Confirmaremos disponibilidad, entrega y forma de pago por WhatsApp.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">{label}</label>
      <div className="flex">
        {prefix && <span className="flex items-center bg-sigo-surface border border-r-0 border-sigo-border text-sigo-light px-3 rounded-l-lg">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={event => onChange(event.target.value)}
          className={`input-sigo ${prefix ? 'rounded-l-none' : ''}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-sigo-border pb-5 mb-5">
      <h3 className="text-sigo-orange font-display font-bold text-sm uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 text-sm py-1">
      <span className="text-sigo-muted">{label}:</span>
      <span className="text-white break-words">{value}</span>
    </div>
  );
}
