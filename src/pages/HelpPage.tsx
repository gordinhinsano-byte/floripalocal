import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Ajuda</h1>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              Precisa de ajuda para publicar, editar ou denunciar um anúncio? Entre em contato com o suporte.
            </p>
            <p>
              E-mail: contato@floripalocal.com.br
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

