
const statusConfig: Record<string, { label: string; cls: string }> = {
  NEW:          { label: 'NUEVO',       cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  SALE:         { label: 'OFERTA',      cls: 'bg-sigo-orange/20 text-sigo-orange border border-sigo-orange/40' },
  POPULAR:      { label: 'POPULAR',   cls: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  LOW_STOCK:    { label: 'POCAS UNIDADES', cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30 badge-pulse' },
  OUT_OF_STOCK: { label: 'AGOTADO', cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  ACTIVE:       { label: 'ACTIVO',    cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  IN_STOCK:     { label: 'DISPONIBLE',  cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
};

export function Badge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.ACTIVE;
  return (
    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded font-display ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function StockBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.IN_STOCK;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full font-display ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const cls = `status-${key}`;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full font-display ${cls}`}>
      {({ Pending: 'Pendiente', Confirmed: 'Confirmado', Preparing: 'Preparando', Shipped: 'Enviado', Delivered: 'Entregado', Cancelled: 'Cancelado' } as Record<string, string>)[status] ?? status}
    </span>
  );
}
