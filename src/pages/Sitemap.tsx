import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { categories } from "@/components/CategoryBar";
import { Helmet } from "react-helmet-async";

const categoryRoutes: Record<string, string> = {
    "Apartamentos - Casas venda": "/c/comprar-imovel",
    "Alugar casas - Apartamentos": "/c/alugar-casa-apartamento",
    "Aluguel temporada": "/c/aluguel-temporada",
    "Troca de casas - Apartamentos": "/c/troca-de-imoveis",
    "Empreendimentos Imóveis": "/c/lancamentos-imobiliarios",
    "Dividir apartamento - Quartos": "/c/aluguel-quarto",
    "Terrenos - Lotes": "/c/terrenos-venda",
    "Estacionamentos - Garagens": "/c/garagens-venda",
    "Casas venda exterior": "/c/imoveis-exterior",
    "Aluguel temporada exterior": "/c/aluguel-temporada-exterior",
    "Terrenos venda Exterior": "/c/terrenos-exterior",
    "Imóveis comerciais": "/c/pontos-comerciais",
    "Estágios - Trainee": "/c/estagios-trainee",
    "Anunciar currículo - Procurar emprego": "/c/curriculos",
    "Acompanhante idosos - Enfermeira": "/c/cuidador-idosos",
    "Empregada doméstica - Diarista": "/c/empregada-domestica",
    "Trabalhar em casa": "/c/trabalho-em-casa",
    "Trabalhos domésticos": "/c/servicos-domesticos",
    "Babás": "/c/babas",
    "Carros usados": "/c/carros-usados",
    "Motos usadas": "/c/motos-scooters",
    "Caminhões usados": "/c/caminhoes-comerciais",
    "Ônibus usados": "/c/onibus-venda",
    "Motor home - Motor trailer": "/c/caravanas-trailers",
    "Lanchas - Barcos - Veleiros": "/c/barcos-lanchas",
    "Acessórios e serviços": "/c/pecas-acessorios",
    "Serviços turismo - Agência turismo": "/c/turismo",
    "Traduções - Serviços de traduções": "/c/traducoes",
    "Serviços de informática": "/c/servicos-informatica",
    "Mudanças - Frete": "/c/mudancas-fretes",
    "Profissionais liberais": "/c/profissionais-liberais",
    "Reparo - Conserto - Reforma": "/c/reformas-manutencao",
    "Bem-Estar - Saúde - Beleza": "/c/saude-beleza",
    "Astrologia - Serv. Espirituais": "/c/esoterismo",
    "Outros serviços": "/c/outros-servicos",
    "Cursos de idiomas": "/c/cursos-idiomas",
    "Cursos de informática": "/c/cursos-informatica",
    "Capacitação profissional": "/c/cursos-profissionalizantes",
    "Professores particulares": "/c/aulas-particulares",
    "Aulas de ginástica": "/c/esportes-danca",
    "Aulas música-Teatro-Dança": "/c/musica-teatro",
    "Outros cursos": "/c/outros-cursos",
    "Animais estimação à venda": "/c/animais-estimacao-venda",
    "Adoção animais de estimação": "/c/adocao-animais",
    "Veterinários-Serviços-Acessórios": "/c/servicos-animais",
    "Móveis-Camas-Cadeiras": "/c/moveis-decoracao",
    "Decoração casa": "/c/utilidades-domesticas",
    "Eletrodomésticos usados": "/c/eletrodomesticos",
    "Artigos de coleção": "/c/colecionaveis",
    "Equipamentos profissionais": "/c/equipamentos-profissionais",
    "Artigos esportivos - Bicicletas": "/c/esportes-lazer",
    "Artesanato - Feito à mão": "/c/artesanato",
    "Idéias para presentes": "/c/presentes",
    "Instrumentos musicais": "/c/instrumentos-musicais",
    "Bebidas - Comidas": "/c/gastronomia",
    "Notebooks - Computadores usados": "/c/computadores-perifericos",
    "DVD - Video Games - Livros - CD": "/c/games-livros-filmes",
    "MP3 - Ipod - Celulares": "/c/celulares-acessorios",
    "Antiguidades - Jóias": "/c/joias-relogios",
    "Roupas e acessórios": "/c/roupas-calcados",
    "Produtos beleza - Saúde": "/c/beleza-saude",
    "Diversos": "/c/outros-produtos",
    "Procurar amigos": "/c/amizade",
    "Procurar amor": "/c/namoro",
    "Mulher procura homem": "/c/mulher-procura-homem",
    "Homem procura mulher": "/c/homem-procura-mulher",
    "Mullher procura mulher": "/c/mulher-procura-mulher",
    "Homem procura homem": "/c/homem-procura-homem",
    "Encontros casuais": "/c/encontros",
    "Acompanhantes": "/c/acompanhantes",
    "Acompanhantes trans": "/c/acompanhantes-trans",
    "Acompanhantes masculinos": "/c/acompanhantes-masculinos",
    "Vagas de emprego": "/c/vagas-emprego",
};

const staticPages = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Registrar", path: "/register" },
    { name: "Minha Conta", path: "/minha-conta" },
    { name: "Publicar Anúncio", path: "/publicar-anuncio" },
    { name: "Ajuda", path: "/ajuda" },
    { name: "Termos de Uso", path: "/termos-de-uso" },
    { name: "Política de Privacidade", path: "/politica-de-privacidade" },
];

const Sitemap = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Helmet>
                <title>Mapa do Site | FloripaLocal</title>
                <meta name="description" content="Mapa do site do FloripaLocal. Encontre todas as categorias e páginas do nosso classificados." />
            </Helmet>

            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mapa do Site</h1>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-bold text-viva-red mb-4 border-b pb-2">Páginas Principais</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {staticPages.map((page) => (
                            <Link
                                key={page.path}
                                to={page.path}
                                className="text-gray-700 hover:text-viva-red hover:underline block"
                            >
                                {page.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <div key={category.name} className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-viva-red mb-4 border-b pb-2">{category.name}</h2>
                            <div className="space-y-4">
                                {category.columns.map((column, colIdx) => (
                                    <div key={colIdx} className="space-y-4">
                                        {column.groups.map((group, groupIdx) => (
                                            <div key={groupIdx}>
                                                {group.title && (
                                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 mt-4 first:mt-0">
                                                        {group.title}
                                                    </h3>
                                                )}
                                                <ul className="space-y-2">
                                                    {group.items.map((item) => {
                                                        const path = categoryRoutes[item] || "#";
                                                        return (
                                                            <li key={item}>
                                                                <Link
                                                                    to={path}
                                                                    className="text-gray-700 hover:text-viva-red hover:underline block text-sm"
                                                                >
                                                                    {item}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Sitemap;
