import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 text-red-500 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Ops! Algo deu errado
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Desculpe, ocorreu um erro ao carregar esta página. Por favor, tente novamente.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#ff8000] hover:bg-[#e67300] text-white font-bold py-2 px-6 rounded transition-colors"
                        >
                            Recarregar Página
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="mt-3 block w-full text-gray-600 hover:text-gray-800 text-sm"
                        >
                            Voltar para a página inicial
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
