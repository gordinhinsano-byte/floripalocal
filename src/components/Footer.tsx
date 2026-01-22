import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "IMÓVEIS",
    links: [
      { label: "Apartamentos - Casas venda", slug: "comprar-imovel" },
      { label: "Alugar casas - Apartamentos", slug: "alugar-casa-apartamento" },
      { label: "Aluguel temporada", slug: "aluguel-temporada" },
      { label: "Troca de casas", slug: "troca-de-imoveis" },
      { label: "Empreendimentos Imóveis", slug: "lancamentos-imobiliarios" },
      { label: "Dividir apartamento", slug: "aluguel-quarto" },
      { label: "Terrenos - Lotes", slug: "terrenos-venda" },
      { label: "Estacionamentos", slug: "garagens-venda" },
    ],
  },
  {
    title: "IMÓVEIS EXTERIOR",
    links: [
      { label: "Casas venda exterior", slug: "imoveis-exterior" },
      { label: "Aluguel temporada exterior", slug: "aluguel-temporada-exterior" },
    ],
  },
  {
    title: "EMPREGOS",
    links: [
      { label: "Vagas de emprego", slug: "vagas-emprego" },
      { label: "Estágios - Trainee", slug: "estagios-trainee" },
      { label: "Anunciar currículo", slug: "curriculos" },
      { label: "Trabalhos domésticos", slug: "servicos-domesticos" },
    ],
  },
  {
    title: "VEÍCULOS",
    links: [
      { label: "Carros usados", slug: "carros-usados" },
      { label: "Motos usadas", slug: "motos-scooters" },
      { label: "Caminhões usados", slug: "caminhoes-comerciais" },
      { label: "Ônibus usados", slug: "onibus-venda" },
      { label: "Lanchas - Barcos", slug: "barcos-lanchas" },
      { label: "Aluguel carros", slug: "aluguel-carros" },
      { label: "Acessórios e serviços", slug: "pecas-acessorios" },
    ],
  },
  {
    title: "AGRONEGÓCIOS",
    links: [
      { label: "Animais do campo", slug: "animais-campo" },
      { label: "Alimentação pecuária", slug: "alimentacao-pecuaria" },
      { label: "Produtos rurais", slug: "produtos-rurais" },
      { label: "Maquinária agrícola", slug: "maquinaria-agricola" },
      { label: "Serviços agropecuários", slug: "servicos-agropecuarios" },
      { label: "Fazendas - Sítios", slug: "fazendas-sitios" },
    ],
  },
  {
    title: "ANIMAIS",
    links: [
      { label: "Animais à venda", slug: "animais-estimacao-venda" },
      { label: "Adoção de animais", slug: "adocao-animais" },
      { label: "Veterinários", slug: "servicos-animais" },
      { label: "Serviços - Acessórios", slug: "servicos-animais" },
    ],
  },
  {
    title: "RELACIONAMENTOS",
    links: [
      { label: "Procurar Amigos", slug: "amizade" },
      { label: "Procurar Amor", slug: "namoro" },
      { label: "Relações Gays - Lésbicas", slug: "encontros" },
      { label: "Encontros Casuais", slug: "encontros" },
      { label: "Acompanhantes", slug: "acompanhantes" },
    ],
  },
  {
    title: "SERVIÇOS",
    links: [
      { label: "Serviços turismo", slug: "turismo" },
      { label: "Traduções", slug: "traducoes" },
      { label: "Serviços de informática", slug: "servicos-informatica" },
      { label: "Mudanças - Frete", slug: "mudancas-fretes" },
      { label: "Profissionais liberais", slug: "profissionais-liberais" },
      { label: "Reparo - Conserto", slug: "reformas-manutencao" },
      { label: "Bem-Estar - Saúde", slug: "saude-beleza" },
      { label: "Outros serviços", slug: "outros-servicos" },
    ],
  },
  {
    title: "COMUNIDADE",
    links: [
      { label: "Artistas - Músicos", slug: "artistas-musicos" },
      { label: "Guia restaurantes", slug: "guia-restaurantes" },
      { label: "Receitas culinárias", slug: "receitas-culinarias" },
      { label: "Contatos perdidos", slug: "contatos-perdidos" },
      { label: "Atividades locais", slug: "atividades-locais" },
      { label: "Eventos", slug: "eventos" },
    ],
  },
  {
    title: "COMPRA E VENDA",
    links: [
      { label: "Artigos para casa", slug: "moveis-decoracao" },
      { label: "Lazer e entretenimento", slug: "esportes-lazer" },
      { label: "Artigos eletrônicos", slug: "celulares-acessorios" },
      { label: "Moda e acessórios", slug: "roupas-calcados" },
      { label: "Diversos", slug: "outros-produtos" },
    ],
  },
  {
    title: "CURSOS",
    links: [
      { label: "Cursos de idiomas", slug: "cursos-idiomas" },
      { label: "Cursos de informática", slug: "cursos-informatica" },
      { label: "Capacitação profissional", slug: "cursos-profissionalizantes" },
      { label: "Professores particulares", slug: "aulas-particulares" },
      { label: "Aulas de ginástica", slug: "esportes-danca" },
      { label: "Aulas música - Dança", slug: "musica-teatro" },
      { label: "Outros cursos", slug: "outros-cursos" },
    ],
  },
];

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const mainCities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador",
  "Fortaleza", "Curitiba", "Recife", "Porto Alegre", "Manaus", "Goiânia",
  "Belém", "Guarulhos", "Campinas", "São Luís", "Maceió", "Campo Grande",
];

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Categories Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-xs mb-3 text-viva-green">{section.title}</h4>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.slug + link.label}>
                    <Link 
                      to={`/c/${link.slug}`} 
                      className="text-[11px] text-gray-400 hover:text-white transition-colors leading-tight block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* States Section Removed */}
      {/* Cities Section Removed */}

      {/* Bottom Section */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center">
              <Link to="/">
                <img src="/logoflb.svg" alt="FloripaLocal" className="h-12 w-auto object-contain" />
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Quem somos</a>
              <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
              <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
              <a href="#" className="hover:text-white transition-colors">Política de Cookies</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
              <Link to="/ajuda" className="hover:text-white transition-colors">Ajuda</Link>
            </div>
            <p className="text-[11px] text-gray-500">
              © 2026 FloripaLocal
            </p>
          </div>
        </div>
      </div>
    </footer >
  );
};
