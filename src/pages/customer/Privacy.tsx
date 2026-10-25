import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '../../components/ui/Icons';

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-sigo-muted mb-6">
        <Link to="/" className="hover:text-white">Inicio</Link>
        <ChevronRightIcon size={14} />
        <span className="text-sigo-light">Política de privacidad</span>
      </nav>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-0.5 bg-sigo-orange" />
        <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.2em] uppercase">Legal</span>
      </div>
      <h1 className="font-display font-black text-4xl text-white uppercase mb-2">Política de privacidad</h1>
      <p className="text-sigo-muted text-sm mb-8">Última actualización: enero 2025</p>

      <div className="space-y-8 text-sigo-light leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">1. Información que recopilamos</h2>
          <p>
            En SIGO Autorepuestos recopilamos únicamente los datos necesarios para
            atender tu solicitud: nombre, teléfono, correo electrónico y dirección
            de entrega. Estos datos se proporcionan de forma voluntaria cuando creas
            una cuenta, realizas un pedido o nos contactas por WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">2. Uso de la información</h2>
          <p>Utilizamos tus datos para:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sigo-muted">
            <li>Procesar y coordinar tus pedidos y entregas.</li>
            <li>Brindar atención y soporte a través de WhatsApp y correo.</li>
            <li>Informarte sobre el estado de tus solicitudes.</li>
            <li>Mejorar nuestro catálogo y la experiencia de compra.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">3. Protección de datos</h2>
          <p>
            Tratamos tu información con confidencialidad y aplicamos medidas
            razonables para protegerla. No vendemos ni compartimos tus datos
            personales con terceros ajenos a la operación de tu pedido.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">4. Pedidos por WhatsApp</h2>
          <p>
            Los pedidos se coordinan a través de WhatsApp. Al enviar un mensaje,
            la información compartida se rige también por las políticas de privacidad
            de la plataforma de mensajería.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">5. Tus derechos</h2>
          <p>
            Puedes solicitar el acceso, la corrección o la eliminación de tus datos
            personales escribiéndonos a <span className="text-sigo-orange">info@sigoautorepuestos.com</span>.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">6. Contacto</h2>
          <p>
            Si tienes dudas sobre esta política, contáctanos por WhatsApp al
            +502 4575 2892 o visita nuestra página de <Link to="/contact" className="text-sigo-orange hover:underline">Contacto</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
