const footerSections = [
  {
    title: "IMÓVEIS",
    links: [
      "Apartamentos - Casas venda",
      "Alugar casas - Apartamentos",
      "Aluguel temporada",
      "Troca de casas",
      "Empreendimentos Imóveis",
      "Dividir apartamento",
      "Terrenos - Lotes",
      "Estacionamentos",
    ],
  },
  {
    title: "IMÓVEIS EXTERIOR",
    links: [
      "Casas venda exterior",
      "Aluguel temporada exterior",
    ],
  },
  {
    title: "EMPREGOS",
    links: [
      "Vagas de emprego",
      "Estágios - Trainee",
      "Anunciar currículo",
      "Trabalhos domésticos",
    ],
  },
  {
    title: "VEÍCULOS",
    links: [
      "Carros usados",
      "Motos usadas",
      "Caminhões usados",
      "Ônibus usados",
      "Lanchas - Barcos",
      "Aluguel carros",
      "Acessórios e serviços",
    ],
  },
  {
    title: "AGRONEGÓCIOS",
    links: [
      "Animais do campo",
      "Alimentação pecuária",
      "Produtos rurais",
      "Maquinária agrícola",
      "Serviços agropecuários",
      "Fazendas - Sítios",
    ],
  },
  {
    title: "ANIMAIS",
    links: [
      "Animais à venda",
      "Adoção de animais",
      "Veterinários",
      "Serviços - Acessórios",
    ],
  },
  {
    title: "RELACIONAMENTOS",
    links: [
      "Procurar Amigos",
      "Procurar Amor",
      "Relações Gays - Lésbicas",
      "Encontros Casuais",
      "Acompanhantes",
    ],
  },
  {
    title: "SERVIÇOS",
    links: [
      "Serviços turismo",
      "Traduções",
      "Serviços de informática",
      "Mudanças - Frete",
      "Profissionais liberais",
      "Reparo - Conserto",
      "Bem-Estar - Saúde",
      "Outros serviços",
    ],
  },
  {
    title: "COMUNIDADE",
    links: [
      "Artistas - Músicos",
      "Guia restaurantes",
      "Receitas culinárias",
      "Contatos perdidos",
      "Atividades locais",
      "Eventos",
    ],
  },
  {
    title: "COMPRA E VENDA",
    links: [
      "Artigos para casa",
      "Lazer e entretenimento",
      "Artigos eletrônicos",
      "Moda e acessórios",
      "Diversos",
    ],
  },
  {
    title: "CURSOS",
    links: [
      "Cursos de idiomas",
      "Cursos de informática",
      "Capacitação profissional",
      "Professores particulares",
      "Aulas de ginástica",
      "Aulas música - Dança",
      "Outros cursos",
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
                  <li key={link}>
                    <a href="#" className="text-[11px] text-gray-400 hover:text-white transition-colors leading-tight block">
                      {link}
                    </a>
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
              <span className="text-lg font-bold">
                <span className="text-viva-green">floripa</span>
                <span className="text-white">local</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Quem somos</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Política de Cookies</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
              <a href="#" className="hover:text-white transition-colors">Ajuda</a>
            </div>
            <p className="text-[11px] text-gray-500">
              © 2024 FloripaLocal
            </p>
          </div>
        </div>
      </div>
    </footer >
  );
};
