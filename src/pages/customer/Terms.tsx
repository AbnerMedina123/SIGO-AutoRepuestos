import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '../../components/ui/Icons';

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-sigo-muted mb-6">
        <Link to="/" className="hover:text-white">Inicio</Link>
        <ChevronRightIcon size={14} />
        <span className="text-sigo-light">Términos y condiciones</span>
      </nav>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-0.5 bg-sigo-orange" />
        <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.2em] uppercase">Legal</span>
      </div>
      <h1 className="font-display font-black text-4xl text-white uppercase mb-2">Términos y condiciones</h1>
      <p className="text-sigo-muted text-sm mb-8">Última actualización: enero 2025</p>

      <div className="space-y-8 text-sigo-light leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">1. Aceptación</h2>
          <p>
            Al utilizar el sitio de SIGO Autorepuestos aceptas estos términos y
            condiciones. Si no estás de acuerdo con ellos, te pedimos no utilizar
            el sitio ni realizar pedidos.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">2. Productos y precios</h2>
          <p>
            Los precios se muestran en quetzales (Q) e incluyen impuestos cuando
            corresponda. Procuramos mantener la información actualizada, pero los
            precios y la disponibilidad pueden cambiar sin previo aviso. La
            disponibilidad final se confirma al coordinar tu pedido por WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">3. Pedidos y pago</h2>
          <p>
            Los pedidos se coordinan por WhatsApp. No se procesan cobros en línea
            dentro del sitio. El método de pago, el costo de envío y la entrega se
            acuerdan directamente con nuestro equipo al confirmar la solicitud.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">4. Envíos y entregas</h2>
          <p>
            Ofrecemos entrega a domicilio y recolección en tienda. Los tiempos de
            entrega dependen de la ubicación y la disponibilidad del producto. El
            envío es gratuito en compras mayores a Q200.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">5. Garantías</h2>
          <p>
            Cada producto indica su garantía específica, la cual cubre defectos de
            fabricación bajo condiciones normales de uso. No cubre daños por mala
            instalación, desgaste normal o uso indebido.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">6. Cambios y devoluciones</h2>
          <p>
            Para gestionar un cambio o devolución, contáctanos por WhatsApp con el
            número de pedido y una descripción del caso. Evaluaremos cada solicitud
            conforme a la garantía del producto.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-2">7. Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos, escríbenos por WhatsApp
            al +502 4575 2892 o visita nuestra página de <Link to="/contact" className="text-sigo-orange hover:underline">Contacto</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
