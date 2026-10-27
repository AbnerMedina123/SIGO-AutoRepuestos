import { useRef, useState } from 'react';
import { uploadImage } from '../../lib/api';
import { imgFallback } from '../../lib/images';

interface Props {
  /** URL actual de la imagen (si ya hay una). */
  value: string;
  /** Se llama con la nueva URL pública tras subir, o '' al quitar. */
  onChange: (url: string) => void;
  /** Carpeta dentro del bucket (ej. "categories", "products"). */
  folder?: string;
  label?: string;
}

/**
 * Permite subir una imagen arrastrándola o seleccionándola desde el equipo.
 * Sube el archivo a Supabase Storage y devuelve la URL pública vía onChange.
 */
export function ImageUploader({ value, onChange, folder = 'uploads', label = 'Imagen' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error
          ? e.message
          : 'No se pudo subir la imagen. Verifica tu sesión de administrador.',
      );
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <label className="label-admin">{label}</label>

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-sigo-border">
          <img src={value} alt="Vista previa" onError={imgFallback} className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-sigo-orange text-white text-sm font-semibold px-3 py-1.5 rounded-lg"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500/90 text-white text-sm font-semibold px-3 py-1.5 rounded-lg"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          className={`cursor-pointer rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragging
              ? 'border-sigo-orange bg-sigo-orange/10'
              : 'border-sigo-border hover:border-sigo-orange/50 bg-sigo-surface'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-sigo-muted">
              <div className="w-8 h-8 border-4 border-sigo-border border-t-sigo-orange rounded-full animate-spin" />
              <span className="text-sm">Subiendo imagen...</span>
            </div>
          ) : (
            <div className="text-sigo-muted">
              <div className="text-3xl mb-2">🖼️</div>
              <p className="text-sm text-sigo-light font-medium">
                Arrastra una imagen aquí
              </p>
              <p className="text-xs mt-1">o haz clic para buscarla en tu equipo</p>
              <p className="text-xs mt-2 text-sigo-muted">JPG, PNG o WebP · máx. 5 MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
