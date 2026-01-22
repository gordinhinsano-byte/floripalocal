import { categories } from "./CategoryBar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { 
    Home, 
    Briefcase, 
    Truck, 
    Wrench, 
    GraduationCap, 
    PawPrint, 
    Tag, 
    Heart,
    MapPin,
    PlusCircle // Usando PlusCircle ou apenas Plus estilizado
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, any> = {
    "Imóveis": Home,
    "Empregos": Briefcase,
    "Veículos": Truck,
    "Serviços": Wrench,
    "Cursos": GraduationCap,
    "Animais de Estimação": PawPrint,
    "Comprar e Vender": Tag,
    "Relacionamentos": Heart,
};

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
};

const generateSlug = (text: string) => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
};

export const MobileCategoryMenu = () => {
    return (
        <div className="w-full bg-white md:hidden border-t border-gray-200">
            <Accordion type="single" collapsible className="w-full">
                {categories.map((category, index) => {
                    const Icon = iconMap[category.name] || Tag;
                    return (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100">
                            {/* 
                                Customizing Trigger:
                                - Hide default chevron: [&>svg]:hidden (assuming shadcn implementation uses an svg child)
                                - Add our own Plus icon that rotates
                            */}
                            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 [&>svg]:hidden">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3 text-gray-700 font-normal text-base">
                                        <Icon className="w-6 h-6 stroke-[1.5]" />
                                        <span>{category.name}</span>
                                    </div>
                                    <div className="rounded-full border border-gray-400 p-0.5 transition-transform duration-200 group-data-[state=open]:rotate-45">
                                        <PlusCircle className="w-5 h-5 text-gray-500 stroke-[1.5]" />
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-gray-50 px-4 pb-4 border-t border-gray-100">
                                <div className="flex flex-col gap-2 pt-2">
                                    {category.columns.map((col, colIdx) => (
                                        <div key={colIdx}>
                                            {col.groups.map((group, gIdx) => (
                                                <div key={gIdx} className="mb-3 last:mb-0">
                                                     {group.title && <h4 className="font-bold text-xs text-gray-400 uppercase mb-2 mt-2 tracking-wider">{group.title}</h4>}
                                                     <ul className="space-y-3">
                                                        {group.items.map(item => {
                                                            const route = categoryRoutes[item] || `/c/${generateSlug(item)}`;
                                                            return (
                                                                <li key={item}>
                                                                    <Link 
                                                                        to={route} 
                                                                        className="text-gray-600 text-sm block hover:text-viva-green"
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
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}

                {/* Item Extra: Região e cidades */}
                 <AccordionItem value="item-region" className="border-b border-gray-100">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 [&>svg]:hidden">
                         <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3 text-gray-700 font-normal text-base">
                                <MapPin className="w-6 h-6 stroke-[1.5]" />
                                <span>Região e cidades</span>
                            </div>
                            <div className="rounded-full border border-gray-400 p-0.5 transition-transform duration-200 group-data-[state=open]:rotate-45">
                                <PlusCircle className="w-5 h-5 text-gray-500 stroke-[1.5]" />
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-50 px-4 py-4">
                        <p className="text-sm text-gray-500">Selecione sua região (Em breve)</p>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
};
