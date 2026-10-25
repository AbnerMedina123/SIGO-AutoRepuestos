import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { supabaseConfigured } from "./lib/supabase"

document.documentElement.lang = "es-419"

function ConfigMissing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d0d",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔌</div>
        <h1 style={{ color: "#ff6a00", fontSize: 24, margin: "0 0 12px" }}>
          Configuración incompleta
        </h1>
        <p style={{ color: "#aaa", lineHeight: 1.6 }}>
          El sitio no encuentra las variables de entorno de Supabase. En Netlify,
          ve a <strong>Site configuration → Environment variables</strong> y agrega{" "}
          <code style={{ color: "#ff6a00" }}>VITE_SUPABASE_URL</code> y{" "}
          <code style={{ color: "#ff6a00" }}>VITE_SUPABASE_PUBLISHABLE_KEY</code>,
          luego vuelve a desplegar (Trigger deploy → Clear cache and deploy).
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {supabaseConfigured ? <App /> : <ConfigMissing />}
    </ErrorBoundary>
  </React.StrictMode>,
)
