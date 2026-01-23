import { useMemo, useState } from "react";
import { toast } from "sonner";
import { importarAnuncio } from "@/lib/importarAnuncio";

type Props = {
  url: string;
  onUrlChange: (next: string) => void;
  onSuccess?: (payload: unknown) => void;
};

export function ImportVivaLocalAd({ url, onUrlChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValidUrl = useMemo(() => {
    const trimmed = url.trim();
    if (!trimmed) return false;
    try {
      const u = new URL(trimmed);
      return u.hostname.includes("vivalocal.com");
    } catch {
      return false;
    }
  }, [url]);

  const handleImport = async () => {
    const trimmed = url.trim();
    setError(null);
    setErrorDetails(null);
    setSuccess(null);

    if (!trimmed) {
      setError("Cole a URL do anúncio.");
      return;
    }
    if (!isValidUrl) {
      setError("URL inválida. Ela precisa conter vivalocal.com");
      return;
    }

    setLoading(true);
    try {
      const payload: any = await importarAnuncio(trimmed);
      if (payload?.success === false) throw new Error(payload?.error || "Falha ao importar anúncio");
      setSuccess(payload?.success === true ? "Anúncio importado com sucesso!" : "Importação concluída!");
      toast.success("Anúncio importado com sucesso!");
      onSuccess?.(payload);
    } catch (e: any) {
      const msg =
        e?.name === "AbortError"
          ? "Tempo excedido ao importar. Tente novamente."
          : (e?.message || "Erro na requisição");
      setError(msg);
      if (e?.cause) {
        try {
          setErrorDetails(JSON.stringify(e.cause, null, 2));
        } catch {
          setErrorDetails(String(e.cause));
        }
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-base font-bold text-gray-700">
        URL do anúncio para importar
      </label>
      <input
        type="url"
        placeholder="https://www.vivalocal.com/..."
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
      />

      <button
        type="button"
        onClick={handleImport}
        disabled={loading || !url.trim()}
        className="px-6 py-2.5 bg-[#ff7f00] text-white font-bold rounded shadow-sm hover:bg-[#e67300] transition-colors disabled:opacity-50 inline-flex items-center gap-2"
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {loading ? "Importando..." : "Importar Anúncio"}
      </button>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {errorDetails && (
        <details className="text-xs text-gray-600 whitespace-pre-wrap">
          <summary className="cursor-pointer">Detalhes do erro</summary>
          {errorDetails}
        </details>
      )}
      {success && <div className="text-sm text-red-700">{success}</div>}
    </div>
  );
}
