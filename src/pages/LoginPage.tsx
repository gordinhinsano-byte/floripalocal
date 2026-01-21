import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { login } from "@/services/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Cloudflare Mock State
    const [captchaStatus, setCaptchaStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleCaptchaVerify = () => {
        if (captchaStatus === 'idle') {
            setCaptchaStatus('loading');
            setTimeout(() => {
                setCaptchaStatus('success');
            }, 1000);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (captchaStatus !== 'success') {
            toast.error("Por favor, confirme que você é humano.");
            return;
        }

        setLoading(true);

        try {
            await login(email, password);

            toast.success("Login realizado com sucesso!");
            navigate("/minha-conta");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erro ao fazer login. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Acessar FloripaLocal
                        </h2>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Endereço de email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-viva-green focus:border-viva-green sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-viva-green focus:border-viva-green sm:text-sm"
                                />
                                {/* Eye Icon Placeholder - functionality can be added if requested, strictly following image for now */}
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Link to="/esqueci-minha-senha" className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>

                        {/* Cloudflare Verification Widget */}
                        <div className="mt-4 border border-gray-200 rounded p-3 flex items-center justify-between bg-[#f9f9f9] select-none">
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={handleCaptchaVerify}
                            >
                                <div className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center">
                                    {captchaStatus === 'loading' && (
                                        <div className="w-5 h-5 border-2 border-gray-200 border-t-viva-green rounded-full animate-spin"></div>
                                    )}
                                    {captchaStatus === 'success' && (
                                        <svg className="w-5 h-5 text-viva-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-gray-700">
                                    {captchaStatus === 'success' ? 'Sou humano' : 'Confirme que é humano'}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <img src="/cloudflare-logo.png" alt="" className="h-5 w-auto opacity-50" />
                                <div className="text-[10px] text-gray-400">
                                    Privacy - Terms
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-viva-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-viva-green disabled:opacity-50 transition-colors"
                            >
                                {loading ? "Entrando..." : "Acesse aqui"}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/register" className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline">
                                Criar uma conta
                            </Link>
                        </div>
                    </form>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-600">
                            Precisa de ajuda? <Link to="/ajuda" className="text-blue-500 hover:underline">Entre em contato conosco aqui</Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
