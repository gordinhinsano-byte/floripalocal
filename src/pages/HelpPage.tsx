import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

export default function HelpPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Central de Ajuda</h1>
                    
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Como publicar um anúncio?</h2>
                            <p className="text-gray-600">
                                Para publicar um anúncio, clique no botão <Link to="/publicar-anuncio" className="text-viva-green font-bold hover:underline">Inserir anúncio</Link> no topo da página.
                                Siga os passos, escolha a categoria correta, adicione fotos e uma descrição detalhada.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Como entrar em contato com um vendedor?</h2>
                            <p className="text-gray-600">
                                Na página do anúncio, você encontrará um formulário de contato e opções para ver o telefone ou chamar no WhatsApp.
                                É necessário estar logado para enviar mensagens pelo chat da plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">É seguro comprar na FloripaLocal?</h2>
                            <p className="text-gray-600">
                                Sim, mas sempre recomendamos cautela. Nunca faça pagamentos antecipados, prefira encontros em locais públicos
                                e verifique o produto antes de fechar negócio. Veja nossas <span className="text-viva-green font-bold">Dicas de Segurança</span>.
                            </p>
                        </section>

                        <div className="pt-6 border-t border-gray-100">
                            <p className="text-gray-500 text-sm">
                                Ainda tem dúvidas? Entre em contato conosco pelo email: <a href="mailto:suporte@floripalocal.com" className="text-blue-600 hover:underline">suporte@floripalocal.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
