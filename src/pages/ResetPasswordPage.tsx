import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash,
        );
        const hashError = hashParams.get("error");
        const hashErrorDescription = hashParams.get("error_description");
        const hashErrorCode = hashParams.get("error_code");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (hashError) {
          setLinkError(
            hashErrorDescription ||
              (hashErrorCode ? `Erro: ${hashErrorCode}` : "Link inválido ou expirado."),
          );
          window.history.replaceState({}, "", window.location.pathname);
        } else if (accessToken && refreshToken && (type === "recovery" || type === "signup" || type === "magiclink")) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          window.history.replaceState({}, "", window.location.pathname);
        }

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          window.history.replaceState({}, "", window.location.pathname);
        }

        const { data } = await supabase.auth.getSession();
        setHasSession(!!data.session);
      } catch {
        setHasSession(false);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso! Faça login novamente.");
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar senha.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Redefinir senha</h2>
            <p className="text-sm text-gray-600 mt-1">
              Defina uma nova senha para sua conta.
            </p>
          </div>

          {loading ? (
            <div className="text-sm text-gray-600">Carregando...</div>
          ) : linkError ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">{linkError}</div>
              <Link
                to="/esqueci-minha-senha"
                className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-viva-green hover:bg-red-700 transition-colors"
              >
                Pedir novo link
              </Link>
            </div>
          ) : hasSession ? (
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-viva-green focus:border-viva-green sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-viva-green focus:border-viva-green sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-viva-green hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-viva-green disabled:opacity-50 transition-colors"
              >
                {saving ? "Salvando..." : "Salvar nova senha"}
              </button>
              <div className="text-center text-xs text-gray-500">
                <Link to="/login" className="font-medium text-viva-green hover:text-red-700">
                  Voltar para o login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Link inválido ou expirado. Solicite um novo link para redefinir sua senha.
              </div>
              <Link
                to="/esqueci-minha-senha"
                className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-viva-green hover:bg-red-700 transition-colors"
              >
                Pedir novo link
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
