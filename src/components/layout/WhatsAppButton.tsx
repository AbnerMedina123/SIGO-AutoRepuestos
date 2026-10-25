import { useState } from 'react';
import { WhatsAppIcon } from '../ui/Icons';
import { WHATSAPP_URL } from '../../lib/whatsapp';

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      title="¿Necesitas ayuda? Escríbenos por WhatsApp"
      aria-label="Contactar a SIGO Autorepuestos por WhatsApp"
    >
      {showTooltip && (
        <div className="bg-sigo-dark border border-sigo-border text-white text-sm px-3 py-2 rounded-lg shadow-xl whitespace-nowrap menu-fade">
          ¿Necesitas ayuda? Escríbenos por WhatsApp
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-sigo-border" />
        </div>
      )}
      <div className="wa-pulse bg-[#25D366] hover:bg-[#1DA855] text-white rounded-full p-3.5 shadow-2xl transition-transform hover:scale-110">
        <WhatsAppIcon size={26} />
      </div>
    </a>
  );
}
