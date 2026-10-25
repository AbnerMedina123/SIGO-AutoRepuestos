import { useLocation, Link } from 'react-router-dom';
import { CheckIcon, WhatsAppIcon } from '../../components/ui/Icons';
import { WHATSAPP_URL } from '../../lib/whatsapp';

export function OrderConfirmation() {
  const { state } = useLocation();
  const whatsappUrl = state?.whatsappUrl ?? WHATSAPP_URL;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-green-500/10 border border-green-500/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckIcon size={36} className="text-green-400" />
      </div>

      <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase mb-3">
        Pedido enviado a WhatsApp
      </h1>
      <p className="text-sigo-muted text-lg mb-8">
        Tu pedido fue preparado correctamente y estás siendo redirigido a WhatsApp para finalizar la solicitud con SIGO Autorepuestos.
      </p>

      <div className="bg-sigo-card border border-sigo-border rounded-2xl p-6 text-left mb-8">
        <h2 className="font-display font-bold text-white uppercase mb-3">Siguiente paso</h2>
        <p className="text-sigo-light leading-relaxed">
          Envía el mensaje generado en WhatsApp. Nuestro equipo confirmará la disponibilidad de los productos, el costo de envío y la forma de pago.
        </p>
        <p className="text-sigo-muted text-sm mt-4">
          No se realizó ningún cobro en línea.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold px-8 py-3.5 rounded-xl transition-colors"
        >
          <WhatsAppIcon size={19} />
          Continuar en WhatsApp
        </a>
        <Link to="/catalog" className="border border-sigo-border text-sigo-light hover:text-white hover:border-sigo-muted px-8 py-3.5 rounded-xl transition-colors font-semibold">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
