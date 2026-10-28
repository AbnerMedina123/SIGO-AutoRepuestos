import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppIcon, ChevronRightIcon } from '../../components/ui/Icons';
import { createWhatsAppUrl, WHATSAPP_URL } from '../../lib/whatsapp';

const FACEBOOK_URL =
  'https://www.facebook.com/people/SI-GO/pfbid0hASQtr3egfTtquicKVYUSADzfCrFj1ps2GDaWJsGiSYH9Rh8Yhp9joKPd8Qs7XJQl/';

const contactInfo = [
  { icon: '📍', label: 'Dirección', value: 'SIGO Autorepuestos, Guatemala, Guatemala' },
  { icon: '📞', label: 'Teléfono', value: '+502 4575 2892' },
  { icon: '✉️', label: 'Correo', value: 'info@sigoautorepuestos.com' },
  { icon: '🕐', label: 'Horario', value: 'Lun–Vie 8:00–18:00 · Sáb 8:00–13:00' },
];

export function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Ingresa tu nombre';
    if (!form.phone.trim()) next.phone = 'Ingresa tu teléfono';
    if (!form.message.trim()) next.message = 'Escribe tu mensaje';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Correo no válido';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = `Hola, SIGO Autorepuestos. Me gustaría contactarlos:

*Nombre:* ${form.name.trim()}
*Teléfono:* ${form.phone.trim().startsWith('+502') ? form.phone.trim() : `+502 ${form.phone.trim()}`}
${form.email.trim() ? `*Correo:* ${form.email.trim()}\n` : ''}
*Mensaje:*
${form.message.trim()}`;

    window.open(createWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const inputClass = (field: string) =>
    `w-full bg-sigo-surface border text-white placeholder-sigo-muted px-4 py-2.5 rounded-lg focus:outline-none transition-colors ${
      errors[field] ? 'border-red-500 focus:border-red-500' : 'border-sigo-border focus:border-sigo-orange'
    }`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-sigo-muted mb-6">
        <Link to="/" className="hover:text-white">Inicio</Link>
        <ChevronRightIcon size={14} />
        <span className="text-sigo-light">Contacto</span>
      </nav>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-0.5 bg-sigo-orange" />
        <span className="text-sigo-orange font-display text-sm font-bold tracking-[0.2em] uppercase">Estamos para ayudarte</span>
      </div>
      <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase mb-3">Contacto</h1>
      <p className="text-sigo-muted text-lg max-w-2xl mb-10">
        ¿Buscas un repuesto específico o tienes una consulta? Déjanos tu mensaje y
        te atenderemos por WhatsApp lo antes posible.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 bg-sigo-card border border-sigo-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl text-white mb-4">Envíanos un mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm text-sigo-light mb-1">Nombre <span className="text-sigo-orange">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Tu nombre completo"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-sigo-light mb-1">Teléfono <span className="text-sigo-orange">*</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="0000-0000"
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm text-sigo-light mb-1">Correo</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="tucorreo@email.com"
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-sigo-light mb-1">Mensaje <span className="text-sigo-orange">*</span></label>
              <textarea
                value={form.message}
                onChange={e => update('message', e.target.value)}
                rows={5}
                placeholder="Cuéntanos qué repuesto buscas o tu consulta..."
                className={inputClass('message')}
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb356] text-white font-display font-bold py-3.5 rounded-xl transition-colors uppercase"
            >
              <WhatsAppIcon size={20} />
              Enviar por WhatsApp
            </button>
            <p className="text-sigo-muted text-xs text-center">
              Al enviar, se abrirá WhatsApp con tu mensaje listo para despacharlo.
            </p>
          </form>
        </div>

        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-sigo-card border border-sigo-border rounded-2xl p-6">
            <h2 className="font-display font-bold text-xl text-white mb-4">Datos de contacto</h2>
            <ul className="space-y-4">
              {contactInfo.map(c => (
                <li key={c.label} className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{c.icon}</span>
                  <div>
                    <p className="text-sigo-muted text-xs uppercase tracking-wider font-semibold">{c.label}</p>
                    <p className="text-sigo-light text-sm mt-0.5">{c.value}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <span className="text-2xl leading-none">📘</span>
                <div>
                  <p className="text-sigo-muted text-xs uppercase tracking-wider font-semibold">Facebook</p>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sigo-orange hover:underline text-sm mt-0.5 inline-block"
                  >
                    SI GO Autorepuestos
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/20 font-semibold py-3.5 rounded-2xl transition-colors"
          >
            <WhatsAppIcon size={20} />
            Escríbenos directamente
          </a>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#1877F2]/10 border border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/20 font-semibold py-3.5 rounded-2xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
            </svg>
            Síguenos en Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
