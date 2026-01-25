export const categories = [
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
                            "Serviços de informática",
                            "Mudanças - Frete",
                            "Profissionais liberais",
                            "Reparo - Conserto - Reforma",
                            "Bem-Estar - Saúde - Beleza",
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
                            "Capacitação profissional",
                            "Professores particulares",
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
                            "Adoção animais de estimação",
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
        ],
    },
];

export const categoryRoutes: Record<string, string> = {
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
