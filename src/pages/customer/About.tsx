import { Link } from 'react-router-dom';
import { useData } from '../../store/DataProvider';
import {
  WhatsAppIcon,
  ShieldIcon,
  TruckIcon,
  UsersIcon,
  CheckIcon,
  ChevronRightIcon,
} from '../../components/ui/Icons';
import { WHATSAPP_URL } from '../../lib/whatsapp';

const values = [
  {
    icon: <ShieldIcon size={26} className="text-sigo-orange" />,
    title: 'Calidad garantizada',
    desc: 'Trabajamos con marcas reconocidas y repuestos que cumplen o superan las especificaciones del fabricante.',
  },
  {
    icon: <TruckIcon size={26} className="text-sigo-orange" />,
    title: 'Cobertura nacional',
    desc: 'Entregamos en toda Guatemala, con despacho ágil de los productos disponibles.',
  },
  {
    icon: <UsersIcon size={26} className="text-sigo-orange" />,
    title: 'Atención experta',
    desc: 'Un equipo que conoce de vehículos livianos y pesados, listo para asesorarte por WhatsApp.',
  },
];

const stats = [
  { v: '5,000+', l: 'Productos en catálogo' },
  { v: '200+', l: 'Marcas disponibles' },
  { v: '10K+', l: 'Clientes atendidos' },
  { v: '15+', l: 'Años de experiencia' },
];

export function About() {
  const { categories } = useData();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sigo-border">
        <div className="absolute inset-0 stripe-accent opacity-20" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sigo-orange" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
          <nav className="flex items-center gap-2 text-sm text-sigo-muted mb-6">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <ChevronRightIcon size={14} />
            <span className="text-sigo-light">Nosotros</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-sigo-orange" />
            <span className="text-sigo-orange font-display font-bold text-sm tracking-[0.2em] uppercase">Quiénes somos</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white uppercase leading-[0.95] mb-5">
            Repuestos en los que<br /><span className="text-gradient">puedes confiar</span>
          </h1>
          <p className="text-sigo-light text-lg max-w-2xl leading-relaxed">
            SIGO Autorepuestos nació para facilitar a mecánicos, transportistas y
            conductores el acceso a repuestos de calidad para vehículos livianos y
            pesados, con atención cercana y precios justos en toda Guatemala.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-display font-black text-3xl text-white uppercase mb-4">Nuestra historia</h2>
            <div className="space-y-4 text-sigo-light leading-relaxed">
              <p>
                Comenzamos como un negocio familiar dedicado a conseguir el repuesto
                correcto para cada vehículo. Con el tiempo construimos una red de
                proveedores confiables y un catálogo que abarca desde partes de motor
                hasta componentes especializados para vehículos pesados.
              </p>
              <p>
                Hoy combinamos la cercanía de siempre con la comodidad de un catálogo
                en línea: eliges tu repuesto, lo confirmas por WhatsApp y coordinamos
                la entrega. Sin complicaciones.
              </p>
            </div>
          </div>
          <div className="bg-sigo-card border border-sigo-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-xl text-white mb-4">Por qué elegirnos</h3>
            <ul className="space-y-3">
              {[
                'Repuestos para vehículos livianos y pesados',
                'Marcas reconocidas y garantía en las principales categorías',
                'Asesoría personalizada por WhatsApp',
                'Entrega a domicilio o recolección en tienda',
                'Envío gratis en compras mayores a Q200',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sigo-light">
                  <CheckIcon size={16} className="text-sigo-orange flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-sigo-surface border-y border-sigo-border py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.l}>
              <div className="price-tag text-sigo-orange text-4xl">{s.v}</div>
              <div className="text-sigo-muted text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-sigo-orange" />
            <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.15em] uppercase">Nuestros valores</span>
            <div className="w-8 h-0.5 bg-sigo-orange" />
          </div>
          <h2 className="font-display font-black text-3xl text-white uppercase">Lo que nos mueve</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map(v => (
            <div key={v.title} className="bg-sigo-card border border-sigo-border rounded-xl p-6 hover:border-sigo-orange/40 transition-colors">
              <div className="bg-sigo-orange/10 border border-sigo-orange/30 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">{v.title}</h3>
              <p className="text-sigo-muted text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-2xl text-white uppercase">Lo que ofrecemos</h2>
          <Link to="/catalog" className="flex items-center gap-1 text-sigo-orange hover:text-sigo-orange-light text-sm font-semibold">
            Ver catálogo <ChevronRightIcon size={16} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <Link
              key={c.id}
              to={`/catalog?category=${c.id}`}
              className="px-4 py-2 rounded-lg border border-sigo-border bg-sigo-card text-sigo-light hover:text-white hover:border-sigo-orange/40 text-sm font-medium transition-colors"
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-sigo-orange mx-4 mb-16 rounded-2xl max-w-5xl md:mx-auto">
        <div className="absolute inset-0 stripe-accent opacity-20" />
        <div className="relative z-10 px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-black text-3xl text-white uppercase leading-tight">¿Listo para encontrar tu repuesto?</h2>
            <p className="text-orange-100 mt-2">Escríbenos y te ayudamos a conseguir exactamente lo que necesitas.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white text-sigo-orange font-display font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap uppercase"
          >
            <WhatsAppIcon size={22} />
            Contactar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
