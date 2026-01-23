import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    {!submitted ? (
                        <>
                            <div>
                                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                    Esqueceu sua senha?
                                </h2>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Não se preocupe! Digite seu email abaixo e enviaremos instruções para redefinir sua senha.
                                </p>
                            </div>
                            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email-address" className="sr-only">
                                        Email
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-viva-green focus:border-viva-green sm:text-sm"
                                        placeholder="Seu endereço de email cadastrado"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-viva-green hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-viva-green"
                                    >
                                        Redefinir senha
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifique seu email</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Se houver uma conta associada a este email, enviaremos um link para redefinir sua senha.
                            </p>
                            <Link
                                to="/minha-conta"
                                className="font-medium text-viva-green hover:text-red-700"
                            >
                                Voltar para o login
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Lembrou sua senha?{" "}
                            <Link to="/minha-conta" className="font-medium text-viva-green hover:text-red-700">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
