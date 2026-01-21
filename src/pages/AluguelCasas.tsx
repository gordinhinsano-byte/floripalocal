import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { CategoryFilters } from "@/components/CategoryFilters";

export default function AluguelCasas() {
    const navigate = useNavigate();
    const ads = [
        // Anúncio Premium (Destaque)
        {
            id: 1,
            isPremium: true,
            title: "Apartamento 3 Quartos - Mobiliado",
            description: "Apartamento completo com 3 quartos, 2 banheiros, sala ampla, cozinha planejada, área de serviço. Mobiliado e decorado. Próximo a comércio, escolas e transporte público. Condomínio com piscina, salão de festas e academia.",
            price: "R$ 2.500",
            period: "/mês",
            location: "Centro, São Paulo - SP",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
            verified: true,
            photos: 8,
            postedTime: "Há 2 horas"
        },
        // Anúncio Normal
        {
            id: 2,
            isPremium: false,
            title: "Casa 2 Quartos - Jardim das Flores",
            description: "Casa confortável com 2 quartos, sala, cozinha, banheiro, varanda e quintal. Bairro tranquilo e seguro, próximo a mercados e farmácias.",
            price: "R$ 1.800",
            period: "/mês",
            location: "Jardim das Flores, Campinas - SP",
            image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
            verified: false,
            photos: 5,
            postedTime: "Há 5 horas"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <a href="/" className="hover:text-viva-green">Home</a>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Alugar casas - Apartamentos</span>
                    </div>
                </div>
            </div>

            {/* Página Principal */}
            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    {/* Cabeçalho da Página */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Alugar casas - Apartamentos
                        </h1>
                        <p className="text-gray-600">
                            Encontrados <span className="font-semibold">2 anúncios</span> em Brasil
                        </p>
                    </div>

                    {/* Barra de Filtros */}
                    <CategoryFilters categorySlug="alugar-casa-apartamento" />

                    {/* Ordenação */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                            Ordenar por:
                        </div>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-viva-green">
                            <option>Mais recentes</option>
                            <option>Menor preço</option>
                            <option>Maior preço</option>
                            <option>Mais relevantes</option>
                        </select>
                    </div>

                    {/* Listagem de Anúncios */}
                    <div className="space-y-4">
                        {ads.map((ad) => (
                            <article
                                key={ad.id}
                                className={`bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${ad.isPremium
                                    ? 'border-2 border-yellow-400 shadow-lg relative'
                                    : 'border border-gray-200 shadow-md'
                                    }`}
                            >
                                {/* Badge Premium/Destaque */}
                                {ad.isPremium && (
                                    <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                                        <span className="text-sm">⭐</span>
                                        <span>DESTAQUE</span>
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row">
                                    {/* Container da Imagem */}
                                    <div className="relative md:w-72 h-56 md:h-auto flex-shrink-0 bg-gray-100">
                                        <img
                                            src={ad.image}
                                            alt={ad.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Badge de Fotos */}
                                        <div className="absolute bottom-3 right-3 bg-black/75 text-white px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                            <span>{ad.photos}</span>
                                        </div>
                                    </div>

                                    {/* Conteúdo do Anúncio */}
                                    <div className="flex-1 p-5 flex flex-col justify-between">
                                        <div>
                                            {/* Cabeçalho: Título + Verificação */}
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 cursor-pointer transition-colors flex-1 leading-tight">
                                                    {ad.title}
                                                </h3>
                                                {ad.verified && (
                                                    <span className="text-green-600 text-sm font-medium flex items-center gap-1 flex-shrink-0 bg-green-50 px-2 py-1 rounded">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Verificado</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Descrição */}
                                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                                                {ad.description}
                                            </p>

                                            {/* Informações Adicionais */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    {ad.postedTime}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer: Localização + Preço + Ação */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                                            {/* Localização */}
                                            <span className="text-sm text-gray-600 flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">{ad.location}</span>
                                            </span>

                                            {/* Preço + Botão */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <span className="font-bold text-2xl text-green-600">
                                                        {ad.price}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{ad.period}</span>
                                                </div>

                                                <button
                                                    onClick={() => navigate(`/anuncio/${ad.id}`)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                                                    Ver detalhes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Paginação */}
                    <div className="flex justify-center mt-8 gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>
                            Anterior
                        </button>
                        <button className="px-4 py-2 bg-viva-green text-white rounded-lg text-sm font-medium">
                            1
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            2
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            3
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            Próximo
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
