import type { CartItem } from '../store/useStore';

export const WHATSAPP_NUMBER = '50245752892';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  department: string;
  municipality: string;
  address: string;
  zone: string;
  reference: string;
  comments: string;
}

export const formatCurrency = (amount: number) => `Q${amount.toFixed(2)}`;

export function createOrderMessage(
  info: ShippingInfo,
  items: CartItem[],
  subtotal: number,
  shipping: number,
) {
  const products = items
    .map(({ product, quantity }, index) => {
      const unitPrice = product.salePrice ?? product.price;
      return `${index + 1}. ${product.name}
   Código: ${product.code}
   Cantidad: ${quantity}
   Precio unitario: ${formatCurrency(unitPrice)}
   Subtotal: ${formatCurrency(unitPrice * quantity)}`;
    })
    .join('\n\n');

  return `Hola, SIGO Autorepuestos. Quiero realizar el siguiente pedido:

*DATOS DEL CLIENTE*
Nombre: ${info.fullName}
Teléfono: ${info.phone.trim().startsWith('+502') ? info.phone.trim() : `+502 ${info.phone.trim()}`}
Correo: ${info.email}

*DATOS DE ENVÍO*
Departamento: ${info.department}
Municipio: ${info.municipality}
Dirección: ${info.address}
Zona: ${info.zone || 'No indicada'}
Referencia: ${info.reference || 'No indicada'}
Comentarios: ${info.comments || 'Sin comentarios'}

*PRODUCTOS*
${products}

*RESUMEN DEL PEDIDO*
Subtotal: ${formatCurrency(subtotal)}
Envío: ${shipping === 0 ? 'Gratis' : formatCurrency(shipping)}
TOTAL: ${formatCurrency(subtotal + shipping)}

Gracias.`;
}

export const createWhatsAppUrl = (message?: string) =>
  message ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}` : WHATSAPP_URL;
