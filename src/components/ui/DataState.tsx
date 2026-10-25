/** Indicadores reutilizables de carga y error para las vistas con datos de Supabase. */

export function Loading({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-sigo-muted">
      <div className="w-10 h-10 border-4 border-sigo-border border-t-sigo-orange rounded-full animate-spin mb-4" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({
  message = 'Ocurrió un error al cargar los datos.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <p className="text-white font-display font-bold text-lg">Algo salió mal</p>
      <p className="text-sigo-muted mt-2 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 bg-sigo-orange hover:bg-sigo-orange-dark text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
