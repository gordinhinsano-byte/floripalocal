import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";


const categories = [
    {
        name: "Imóveis",
        columns: [
            {
                groups: [
                    {
                        title: "IMÓVEIS",
                        items: [
                            "Apartamentos - Casas venda",
                            "Alugar casas - Apartamentos",
                            "Aluguel temporada",
                            "Troca de casas - Apartamentos",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Empreendimentos Imóveis",
                            "Dividir apartamento - Quartos",
                            "Terrenos - Lotes",
                            "Estacionamentos - Garagens",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "IMÓVEIS EXTERIOR",
                        items: [
                            "Casas venda exterior",
                            "Aluguel temporada exterior",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Terrenos venda Exterior",
                            "Imóveis comerciais",
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Empregos",
        columns: [
            {
                groups: [
                    {
                        title: "EMPREGOS",
                        items: [
                            "Vagas de emprego",
                            "Estágios - Trainee",
                            "Anunciar currículo - Procurar emprego",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Acompanhante idosos - Enfermeira",
                            "Empregada doméstica - Diarista",
                            "Trabalhar em casa",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Trabalhos domésticos",
                            "Babás",
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Veículos",
        columns: [
            {
                groups: [
                    {
                        title: "VEÍCULOS",
                        items: [
                            "Carros usados",
                            "Motos usadas",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Caminhões usados",
                            "Ônibus usados",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Motor home - Motor trailer",
                            "Lanchas - Barcos - Veleiros",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Acessórios e serviços",
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Serviços",
        columns: [
            {
                groups: [
                    {
                        title: "SERVIÇOS",
                        items: [
                            "Serviços turismo - Agência turismo",
                            "Traduções - Serviços de traduções",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Serviços de informática",
                            "Mudanças - Frete",
                            "Profissionais liberais",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Reparo - Conserto - Reforma",
                            "Bem-Estar - Saúde - Beleza",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Astrologia - Serv. Espirituais",
                            "Outros serviços",
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Cursos",
        columns: [
            {
                groups: [
                    {
                        title: "CURSOS",
                        items: [
                            "Cursos de idiomas",
                            "Cursos de informática",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Capacitação profissional",
                            "Professores particulares",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Aulas de ginástica",
                            "Aulas música-Teatro-Dança",
                            "Outros cursos",
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Animais de Estimação",
        columns: [
            {
                groups: [
                    {
                        title: "ANIMAIS ESTIMAÇÃO",
                        items: [
                            "Animais estimação à venda",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Adoção animais de estimação",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "",
                        items: [
                            "Veterinários-Serviços-Acessórios",
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Comprar e Vender",
        columns: [
            {
                groups: [
                    {
                        title: "ARTIGOS PARA CASA",
                        items: [
                            "Móveis-Camas-Cadeiras",
                            "Decoração casa",
                            "Eletrodomésticos usados",
                            "Artigos de coleção",
                            "Equipamentos profissionais",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "LAZER E ENTRETENIMENTO",
                        items: [
                            "Artigos esportivos - Bicicletas",
                            "Artesanato - Feito à mão",
                            "Idéias para presentes",
                            "Instrumentos musicais",
                            "Bebidas - Comidas",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "ARTIGOS ELECTRÔNICOS",
                        items: [
                            "Notebooks - Computadores usados",
                            "DVD - Video Games - Livros - CD",
                            "MP3 - Ipod - Celulares",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "MODA E ACESSÓRIOS",
                        items: [
                            "Antiguidades - Jóias",
                            "Roupas e acessórios",
                            "Produtos beleza - Saúde",
                            "Diversos",
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Relacionamentos",
        columns: [
            {
                groups: [
                    {
                        title: "RELACIONAMENTOS",
                        items: ["Procurar amigos", "Procurar amor", "Mulher procura homem", "Homem procura mulher"],
                    },
                    {
                        title: "RELAÇÕES GAYS - LÉSBICAS",
                        items: ["Mullher procura mulher", "Homem procura homem"],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "ANÚNCIOS ADULTOS",
                        items: ["Encontros casuais", "Acompanhantes", "Acompanhantes trans", "Acompanhantes masculinos"],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "MAIS BUSCADAS",
                        items: [
                            "Acompanhantes de Luxo",
                            "Garotas de Programa",
                            "Garotas de Programa Florianópolis",
                            "Garotas de Programa São José",
                            "Garotas de Programa Palhoça",
                            "Garotas de Programa Biguaçu",
                            "Garotas de Programa Itapema",
                            "Garotas de Programa Balneário Camboriú",
                            "Garotas de Programa Joinville",
                            "Garotas de Programa Blumenau",
                            "Garotas de Programa Chapecó",
                        ],
                    },
                ],
            },
            {
                groups: [
                    {
                        title: "", // No title for continuation
                        items: [
                            "Garotas de Programa Criciúma",
                            "Garotas de Programa Itajaí",
                            "Garotas de Programa Lages",
                            "Garotas de Programa Jaraguá do Sul",
                            "Garotas de Programa Brusque",
                            "Garotas de Programa Tubarão",
                            "Garotas de Programa Caçador",
                        ],
                    },
                ],
            },
        ],
    },
];

export const CategoryBar = () => {
    return (
        <div className="w-full flex justify-center">
            <NavigationMenu className="max-w-[1408px] w-[1408px] bg-[#6c757d]/90 backdrop-blur-[2px] z-30 border-none shadow-none">
                <NavigationMenuList className="justify-center space-x-0 whitespace-nowrap w-full p-0 m-0 list-none">
                    {categories.map((category) => (
                        <NavigationMenuItem key={category.name} className="w-[176px] h-[68px] p-0 m-0 border-r border-black last:border-r-0">
                            <NavigationMenuTrigger
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                className="w-full h-full bg-transparent text-white hover:text-white hover:bg-white/10 data-[state=open]:bg-[#5a6268] data-[state=open]:text-white focus:bg-white/10 focus:text-white rounded-none px-0.5 text-[13px] font-normal flex justify-center items-center text-center whitespace-normal leading-[13px] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100 opacity-100 [&_svg]:hidden"
                            >
                                {category.name}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="w-[1408px] bg-white p-6 shadow-xl">
                                    {/* Grid layout based on number of columns */}
                                    <div className={cn(
                                        "grid gap-4",
                                        category.columns.length === 1 && "grid-cols-1",
                                        category.columns.length === 2 && "grid-cols-2",
                                        category.columns.length === 3 && "grid-cols-3",
                                        category.columns.length === 4 && "grid-cols-4",
                                    )}>
                                        {category.columns.map((column, colIdx) => (
                                            <div key={colIdx} className="space-y-4">
                                                {column.groups.map((group, groupIdx) => (
                                                    <div key={groupIdx}>
                                                        <h3 className={cn(
                                                            "text-sm font-bold text-gray-900 mb-1 uppercase border-b border-gray-200 pb-1",
                                                            !group.title && "invisible select-none"
                                                        )}>
                                                            {group.title || "\u00A0"}
                                                        </h3>
                                                        <ul className="space-y-0">
                                                            {group.items.map((item) => {
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

                                                                    // SEO / Mais Buscadas Mappings
                                                                    "Acompanhantes de Luxo": "/c/acompanhantes",
                                                                    "Garotas de Programa": "/c/acompanhantes",
                                                                    "Garotas de Programa Florianópolis": "/c/acompanhantes",
                                                                    "Garotas de Programa São José": "/c/acompanhantes",
                                                                    "Garotas de Programa Palhoça": "/c/acompanhantes",
                                                                    "Garotas de Programa Biguaçu": "/c/acompanhantes",
                                                                    "Garotas de Programa Itapema": "/c/acompanhantes",
                                                                    "Garotas de Programa Balneário Camboriú": "/c/acompanhantes",
                                                                    "Garotas de Programa Joinville": "/c/acompanhantes",
                                                                    "Garotas de Programa Blumenau": "/c/acompanhantes",
                                                                    "Garotas de Programa Chapecó": "/c/acompanhantes",
                                                                    "Garotas de Programa Criciúma": "/c/acompanhantes",
                                                                    "Garotas de Programa Itajaí": "/c/acompanhantes",
                                                                    "Garotas de Programa Lages": "/c/acompanhantes",
                                                                    "Garotas de Programa Jaraguá do Sul": "/c/acompanhantes",
                                                                    "Garotas de Programa Brusque": "/c/acompanhantes",
                                                                    "Garotas de Programa Tubarão": "/c/acompanhantes",
                                                                    "Garotas de Programa Caçador": "/c/acompanhantes",
                                                                };

                                                                const route = categoryRoutes[item];

                                                                return (
                                                                    <li key={item} >
                                                                        <NavigationMenuLink asChild>
                                                                            {route ? (
                                                                                <Link
                                                                                    to={route}
                                                                                    className="block text-sm text-gray-600 hover:text-blue-600 hover:underline py-0.5"
                                                                                >
                                                                                    {item}
                                                                                </Link>
                                                                            ) : (
                                                                                <a
                                                                                    href="#"
                                                                                    className="block text-sm text-gray-600 hover:text-blue-600 hover:underline py-0.5"
                                                                                >
                                                                                    {item}
                                                                                </a>
                                                                            )}
                                                                        </NavigationMenuLink>
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
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div >
    );
};

