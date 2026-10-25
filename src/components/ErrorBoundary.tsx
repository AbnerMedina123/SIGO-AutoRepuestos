import React from 'react';

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Captura errores de renderizado en toda la app y muestra un mensaje en
 * pantalla en lugar de dejar una página en blanco (pantalla negra).
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown) {
    console.error('Error capturado por ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0d0d',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h1 style={{ color: '#ff6a00', fontSize: 24, margin: '0 0 12px' }}>
              Ocurrió un problema al cargar el sitio
            </h1>
            <p style={{ color: '#aaa', lineHeight: 1.6 }}>{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: 20,
                background: '#ff6a00',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
