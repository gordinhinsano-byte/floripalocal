export const CATEGORY_FILTERS = {
    "alugar-casa-apartamento": {
        label: "Alugar casas - Apartamentos",
        filters: [
            {
                name: "Preço (Aluguel)",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1.000", "1.200", "1.400", "1.600", "1.800", "2.000", "2.500", "3.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1.000", "1.200", "1.400", "1.600", "1.800", "2.000", "2.500", "3.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Quartos",
                type: "range",
                key: "rooms",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["Studio", "1", "2", "3", "4", "5", "7", "8", "9", "10"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Propriedade",
                type: "select",
                key: "property_type",
                options: ["Não importa", "Apartamento", "Casa", "Loft", "Kitnet"] // Added common types as defaults since scrape returned 'Não importa' mostly
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            },
            {
                name: "Anunciante",
                type: "select", // Changed to select for consistency
                key: "advertiser_type",
                options: ["Todos", "Particular", "Imobiliária"]
            }
        ]
    },
    "carros-usados": {
        label: "Carros usados",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "500", "1.000", "1.500", "2.000", "2.500", "3.000", "4.000", "5.000", "7.500", "10.000", "15.000", "20.000", "30.000", "40.000", "50.000", "75.000", "100.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["500", "1.000", "1.500", "2.000", "2.500", "3.000", "4.000", "5.000", "7.500", "10.000", "15.000", "20.000", "30.000", "40.000", "50.000", "75.000", "100.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "KM",
                type: "range",
                key: "mileage",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "10.000", "20.000", "30.000", "40.000", "50.000", "60.000", "70.000", "80.000", "90.000", "100.000", "120.000", "140.000", "160.000", "180.000", "200.000", "250.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["10.000", "20.000", "30.000", "40.000", "50.000", "60.000", "70.000", "80.000", "90.000", "100.000", "120.000", "140.000", "160.000", "180.000", "200.000", "250.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Ano",
                type: "range",
                key: "year",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString()) // Generated years dynamically for brevity
                    },
                    {
                        name: "max",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    }
                ]
            },
            {
                name: "Combustível",
                type: "select",
                key: "fuel",
                options: ["Não importa", "Diesel", "Eléctrico", "Gasolina", "Híbrido", "GNC", "Bio-Diesel", "Alcool"]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            },
            {
                name: "Anunciante",
                type: "select",
                key: "advertiser_type",
                options: ["Todos", "Particular", "Concessionária"]
            }
        ]
    },
    "vagas-emprego": {
        label: "Vagas de emprego",
        filters: [
            {
                name: "Tipo de contrato",
                type: "select",
                key: "contract_type",
                options: ["Não importa", "Permanente", "Freelance", "Temporário"]
            },
            {
                name: "Tipo de anunciante",
                type: "select",
                key: "advertiser_type",
                options: ["Todos", "Particular", "Profissional"]
            }
        ]
    },
    "estagios-trainee": {
        label: "Estágios - Trainee",
        filters: [
            { name: "Tipo", type: "select", key: "type", options: ["Estágio", "Trainee"] },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "curriculos": {
        label: "Anunciar currículo - Procurar emprego",
        filters: [
            { name: "Área", type: "select", key: "area", options: ["Administrativo", "Comercial", "TI", "Saúde", "Outros"] },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "cuidador-idosos": {
        label: "Acompanhante idosos - Enfermeira",
        filters: [
            { name: "Disponibilidade", type: "select", key: "availability", options: ["Integral", "Parcial", "Noturno", "Fim de semana"] },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "empregada-domestica": {
        label: "Empregada doméstica - Diarista",
        filters: [
            { name: "Serviço", type: "select", key: "service", options: ["Diarista", "Mensalista"] },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "trabalho-em-casa": {
        label: "Trabalhar em casa",
        filters: [
            { name: "Tipo", type: "select", key: "type", options: ["Freelance", "Remoto"] },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "servicos-domesticos": {
        label: "Trabalhos domésticos",
        filters: [
            { name: "Tipo", type: "select", key: "type", options: ["Limpeza", "Cozinha", "Jardinagem", "Outros"] },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "babas": {
        label: "Babás",
        filters: [
            { name: "Disponibilidade", type: "select", key: "availability", options: ["Integral", "Parcial", "Noturno", "Fim de semana"] },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "servicos-informatica": {
        label: "Serviços de informática",
        filters: [
            {
                name: "Tipo de anunciante",
                type: "select",
                key: "advertiser_type",
                options: ["Todos", "Particular", "Profissional"]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "cursos-idiomas": {
        label: "Cursos de idiomas",
        filters: [
            {
                name: "Tipo de anunciante",
                type: "select",
                key: "advertiser_type",
                options: ["Todos", "Particular", "Profissional"]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "animais-estimacao-venda": {
        label: "Animais estimação à venda",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                min: 0,
                max: 10000,
                step: 50,
                unit: "R$"
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "celulares-acessorios": {
        label: "MP3 - Ipod - Celulares",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                min: 0,
                max: 10000,
                step: 50,
                unit: "R$"
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "acompanhantes": {
        label: "Acompanhantes",
        filters: [
            {
                name: "Idade",
                type: "select",
                key: "age",
                options: Array.from({ length: 43 }, (_, i) => (18 + i).toString())
            },
            {
                name: "Cachê (30 minutos)",
                type: "price",
                key: "rate_30m"
            },
            {
                name: "Cachê (1 hora)",
                type: "price",
                key: "rate_1h"
            },
            {
                name: "Cachê (2 horas)",
                type: "price",
                key: "rate_2h"
            },
            {
                name: "Eu sou",
                type: "select",
                key: "gender",
                options: ["Mulher", "Homem", "Travesti"]
            },
            {
                name: "Atendo",
                type: "select",
                key: "attends",
                options: ["Todos", "Mulher", "Homem", "Casal", "Travesti"]
            },
            {
                name: "Idiomas",
                type: "checkbox",
                key: "languages",
                options: ["Português", "Inglês", "Espanhol", "Francês", "Italiano", "Alemão"]
            },
            {
                name: "Tipo físico",
                type: "select",
                key: "ethnicity",
                options: ["Todos", "Negro", "Branco", "Oriental", "Mulato", "Mestiços"]
            },
            {
                name: "Serviços",
                type: "select",
                key: "services",
                options: [
                    "Todos",
                    "Acompanhante",
                    "Beijo na boca",
                    "Festas e Eventos",
                    "Inversão de papéis",
                    "Massagem Tântrica",
                    "Outras opções",
                    "Striptease",
                    "Ativa",
                    "Dominação",
                    "Fetiche",
                    "Massagem",
                    "Namoradinha",
                    "Passiva"
                ]
            },
            {
                name: "Locais",
                type: "checkbox",
                key: "locations",
                options: ["Local próprio", "Hotéis e Motéis", "Aceita viajar"]
            }
        ]
    },
    "motos-scooters": {
        label: "Motos - Scooters",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "500", "1.000", "1.500", "2.000", "2.500", "3.000", "4.000", "5.000", "7.500", "10.000", "15.000", "20.000", "30.000", "40.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["500", "1.000", "1.500", "2.000", "2.500", "3.000", "4.000", "5.000", "7.500", "10.000", "15.000", "20.000", "30.000", "40.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Cilindradas",
                type: "range",
                key: "cylinder",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "80", "125", "250", "400", "500", "600", "750", "900", "1.000", "1.100", "1.200"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["80", "125", "250", "400", "500", "600", "750", "900", "1.000", "1.100", "1.200", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Ano",
                type: "range",
                key: "year",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    },
                    {
                        name: "max",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    }
                ]
            },
            {
                name: "KM",
                type: "range",
                key: "mileage",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "10.000", "20.000", "30.000", "40.000", "50.000", "60.000", "70.000", "80.000", "90.000", "100.000", "120.000", "140.000", "160.000", "180.000", "200.000", "250.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["10.000", "20.000", "30.000", "40.000", "50.000", "60.000", "70.000", "80.000", "90.000", "100.000", "120.000", "140.000", "160.000", "180.000", "200.000", "250.000", "Ilimitado"]
                    }
                ]
            }
        ]
    },
    "caminhoes-comerciais": {
        label: "Caminhões - Comerciais",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "500", "1.000", "2.000", "5.000", "10.000", "20.000", "50.000", "100.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["500", "1.000", "2.000", "5.000", "10.000", "20.000", "50.000", "100.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "KM",
                type: "range",
                key: "mileage",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "10.000", "50.000", "100.000", "150.000", "200.000", "250.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["10.000", "50.000", "100.000", "150.000", "200.000", "250.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Ano",
                type: "range",
                key: "year",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    },
                    {
                        name: "max",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    }
                ]
            }
        ]
    },
    "onibus-venda": {
        label: "Ônibus usados",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "500", "1.000", "2.000", "5.000", "10.000", "20.000", "50.000", "100.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["500", "1.000", "2.000", "5.000", "10.000", "20.000", "50.000", "100.000", "Ilimitado"]
                    }
                ]
            }
        ]
    },
    "barcos-lanchas": {
        label: "Barcos - Lanchas",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "500", "1.000", "5.000", "10.000", "50.000", "100.000", "200.000", "300.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["500", "1.000", "5.000", "10.000", "50.000", "100.000", "200.000", "300.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Ano",
                type: "range",
                key: "year",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    },
                    {
                        name: "max",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    }
                ]
            },
            {
                name: "Tamanho (m)",
                type: "range",
                key: "size",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "4", "6", "8", "10", "12", "14", "16", "20", "22"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["4", "6", "8", "10", "12", "14", "16", "20", "22", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Tipo de Barco",
                type: "select",
                key: "boat_type",
                options: ["Todos", "Motorizado", "Veleiro", "Lancha", "Jet", "Inflável", "Canoas, Remo", "Acessório Náutico", "Serviços", "Outros"]
            }
        ]
    },
    "pecas-acessorios": {
        label: "Acessórios e serviços",
        filters: [
            { name: "Preço", type: "range", key: "price", min: 0, max: 2000, step: 20, unit: "R$" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "caravanas-trailers": {
        label: "Caravanas - Trailers",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "500", "1.000", "2.000", "5.000", "10.000", "20.000", "50.000", "100.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["500", "1.000", "2.000", "5.000", "10.000", "20.000", "50.000", "100.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Ano",
                type: "range",
                key: "year",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    },
                    {
                        name: "max",
                        type: "select",
                        options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString())
                    }
                ]
            }
        ]
    },
    "comprar-imovel": {
        label: "Apartamentos - Casas venda",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["0", "50.000", "100.000", "150.000", "200.000", "250.000", "300.000", "350.000", "400.000", "450.000", "500.000", "600.000", "700.000", "800.000", "900.000", "1.000.000", "1.200.000", "1.500.000", "1.750.000", "2.000.000", "2.500.000", "3.000.000", "4.000.000"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["50.000", "100.000", "150.000", "200.000", "250.000", "300.000", "350.000", "400.000", "450.000", "500.000", "600.000", "700.000", "800.000", "900.000", "1.000.000", "1.200.000", "1.500.000", "1.750.000", "2.000.000", "2.500.000", "3.000.000", "4.000.000", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Quartos",
                type: "range",
                key: "rooms",
                subfilters: [
                    {
                        name: "min",
                        type: "select",
                        options: ["Studio", "1", "2", "3", "4", "5", "7", "8", "9", "10"]
                    },
                    {
                        name: "max",
                        type: "select",
                        options: ["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Ilimitado"]
                    }
                ]
            },
            {
                name: "Propriedade",
                type: "select",
                key: "property_type",
                options: ["Todas as propriedades", "Casa", "Flat", "Sobrado", "Cobertura", "Duplex", "Apartamento"]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "aluguel-temporada": {
        label: "Aluguel temporada",
        filters: [
            {
                name: "Preço (Diária)",
                type: "range",
                key: "price",
                subfilters: [
                    { name: "min", type: "select", options: ["0", "50", "100", "200", "300", "400", "500", "1.000"] },
                    { name: "max", type: "select", options: ["100", "200", "300", "400", "500", "1.000", "Ilimitado"] }
                ]
            },
            {
                name: "Quartos",
                type: "range",
                key: "rooms",
                subfilters: [
                    { name: "min", type: "select", options: ["Studio", "1", "2", "3", "4", "5"] },
                    { name: "max", type: "select", options: ["Studio", "1", "2", "3", "4", "5", "Ilimitado"] }
                ]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "lancamentos-imobiliarios": {
        label: "Empreendimentos Imóveis",
        filters: [
            { name: "Preço", type: "range", key: "price", min: 0, max: 2000000, step: 10000, unit: "R$" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "garagens-venda": {
        label: "Estacionamentos - Garagens",
        filters: [
            { name: "Preço", type: "range", key: "price", min: 0, max: 100000, step: 1000, unit: "R$" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "imoveis-exterior": {
        label: "Casas venda exterior",
        filters: [
            { name: "Preço", type: "range", key: "price", min: 0, max: 1000000, step: 5000, unit: "USD" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "aluguel-temporada-exterior": {
        label: "Aluguel temporada exterior",
        filters: [
            { name: "Preço", type: "range", key: "price", min: 0, max: 1000, step: 10, unit: "USD" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "terrenos-exterior": {
        label: "Terrenos venda Exterior",
        filters: [
            { name: "Preço", type: "range", key: "price", min: 0, max: 500000, step: 1000, unit: "USD" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "pontos-comerciais": {
        label: "Imóveis comerciais - Escritórios",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    { name: "min", type: "select", options: ["0", "500", "1.000", "2.000", "5.000", "10.000"] },
                    { name: "max", type: "select", options: ["1.000", "2.000", "5.000", "10.000", "Ilimitado"] }
                ]
            },
            {
                name: "Tamanho (m²)",
                type: "range",
                key: "size",
                subfilters: [
                    { name: "min", type: "select", options: ["0", "50", "100", "200", "500", "1.000"] },
                    { name: "max", type: "select", options: ["100", "200", "500", "1.000", "Ilimitado"] }
                ]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "terrenos-venda": {
        label: "Terrenos - Lotes",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    { name: "min", type: "select", options: ["0", "5.000", "10.000", "50.000", "100.000"] },
                    { name: "max", type: "select", options: ["10.000", "50.000", "100.000", "500.000", "Ilimitado"] }
                ]
            },
            {
                name: "Tamanho (m²)",
                type: "range",
                key: "size",
                subfilters: [
                    { name: "min", type: "select", options: ["0", "100", "250", "500", "1.000", "5.000"] },
                    { name: "max", type: "select", options: ["250", "500", "1.000", "5.000", "Ilimitado"] }
                ]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "aluguel-quarto": {
        label: "Quartos - Compartilhar",
        filters: [
            {
                name: "Preço",
                type: "range",
                key: "price",
                subfilters: [
                    { name: "min", type: "select", options: ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1.000"] },
                    { name: "max", type: "select", options: ["200", "300", "400", "500", "600", "700", "800", "900", "1.000", "Ilimitado"] }
                ]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    },
    "troca-de-imoveis": {
        label: "Troca de casas - Apartamentos",
        filters: [
            {
                name: "Tipo",
                type: "select",
                key: "type",
                options: ["Todos", "Casa", "Apartamento", "Terreno", "Sítio/Chácara"]
            },
            {
                name: "Com fotos",
                type: "checkbox",
                key: "has_photos"
            }
        ]
    }
    ,
    // Comprar e Vender Subcategories
    "moveis-decoracao": { label: "Móveis-Camas-Cadeiras", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 10000, step: 50, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "utilidades-domesticas": { label: "Decoração casa", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 5000, step: 20, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "eletrodomesticos": { label: "Eletrodomésticos usados", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 8000, step: 50, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "colecionaveis": { label: "Artigos de coleção", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 50000, step: 100, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "equipamentos-profissionais": { label: "Equipamentos profissionais", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 100000, step: 100, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "esportes-lazer": { label: "Artigos esportivos - Bicicletas", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 15000, step: 50, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "artesanato": { label: "Artesanato - Feito à mão", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 2000, step: 10, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "presentes": { label: "Idéias para presentes", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 1000, step: 10, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "instrumentos-musicais": { label: "Instrumentos musicais", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 20000, step: 50, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "gastronomia": { label: "Bebidas - Comidas", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 1000, step: 10, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "computadores-perifericos": { label: "Notebooks - Computadores usados", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 15000, step: 50, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "games-livros-filmes": { label: "DVD - Video Games - Livros - CD", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 2000, step: 10, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "joias-relogios": { label: "Antiguidades - Jóias", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 50000, step: 100, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "roupas-calcados": { label: "Roupas e acessórios", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 2000, step: 10, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "beleza-saude": { label: "Produtos beleza - Saúde", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 3000, step: 20, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "outros-produtos": { label: "Diversos", filters: [{ name: "Preço", type: "range", key: "price", min: 0, max: 5000, step: 20, unit: "R$" }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },

    // Serviços Subcategories
    "turismo": { label: "Serviços turismo - Agência turismo", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "traducoes": { label: "Traduções - Serviços de traduções", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "mudancas-fretes": { label: "Mudanças - Frete", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "profissionais-liberais": { label: "Profissionais liberais", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "reformas-manutencao": { label: "Reparo - Conserto - Reforma", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "saude-beleza": { label: "Bem-Estar - Saúde - Beleza", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "esoterismo": { label: "Astrologia - Serv. Espirituais", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "outros-servicos": { label: "Outros serviços", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },

    // Cursos Subcategories
    "cursos-informatica": { label: "Cursos de informática", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "cursos-profissionalizantes": { label: "Capacitação profissional", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "aulas-particulares": { label: "Professores particulares", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "esportes-danca": { label: "Aulas de ginástica", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "musica-teatro": { label: "Aulas música-Teatro-Dança", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "outros-cursos": { label: "Outros cursos", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },

    // Animais Subcategories
    "adocao-animais": { label: "Adoção animais de estimação", filters: [{ name: "Com fotos", type: "checkbox", key: "has_photos" }] },
    "servicos-animais": { label: "Veterinários-Serviços-Acessórios", filters: [{ name: "Tipo de anunciante", type: "select", key: "advertiser_type", options: ["Todos", "Particular", "Profissional"] }, { name: "Com fotos", type: "checkbox", key: "has_photos" }] },

    // Relacionamentos Subcategories
    "acompanhantes-trans": {
        label: "Acompanhantes trans",
        filters: [
            { name: "Idade", type: "select", key: "age", options: Array.from({ length: 43 }, (_, i) => (18 + i).toString()) },
            { name: "Eu sou", type: "select", key: "gender", options: ["Mulher", "Homem", "Travesti"] },
            { name: "Atendo", type: "select", key: "attends", options: ["Todos", "Mulher", "Homem", "Casal", "Travesti"] },
            { name: "Idiomas", type: "checkbox", key: "languages", options: ["Português", "Inglês", "Espanhol", "Francês", "Italiano", "Alemão"] },
            { name: "Cachê (30 minutos)", type: "price", key: "rate_30m" },
            { name: "Cachê (1 hora)", type: "price", key: "rate_1h" },
            { name: "Cachê (2 horas)", type: "price", key: "rate_2h" },
            { name: "Mídia", type: "checkbox", key: "has_media", options: ["Com fotos", "Com vídeos", "Foto Verificada"] }
        ]
    },
    "acompanhantes-masculinos": {
        label: "Acompanhantes masculinos",
        filters: [
            { name: "Idade", type: "select", key: "age", options: Array.from({ length: 43 }, (_, i) => (18 + i).toString()) },
            { name: "Eu sou", type: "select", key: "gender", options: ["Mulher", "Homem", "Travesti"] },
            { name: "Atendo", type: "select", key: "attends", options: ["Todos", "Mulher", "Homem", "Casal", "Travesti"] },
            { name: "Idiomas", type: "checkbox", key: "languages", options: ["Português", "Inglês", "Espanhol", "Francês", "Italiano", "Alemão"] },
            { name: "Cachê (30 minutos)", type: "price", key: "rate_30m" },
            { name: "Cachê (1 hora)", type: "price", key: "rate_1h" },
            { name: "Cachê (2 horas)", type: "price", key: "rate_2h" },
            { name: "Mídia", type: "checkbox", key: "has_media", options: ["Com fotos", "Com vídeos", "Foto Verificada"] }
        ]
    },
    "amizade": {
        label: "Procurar amigos",
        filters: [
            { name: "Idade", type: "range", key: "age", min: 18, max: 70, step: 1, unit: "anos" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "namoro": {
        label: "Procurar amor",
        filters: [
            { name: "Idade", type: "range", key: "age", min: 18, max: 70, step: 1, unit: "anos" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "mulher-procura-homem": {
        label: "Mulher procura homem",
        filters: [
            { name: "Idade", type: "range", key: "age", min: 18, max: 70, step: 1, unit: "anos" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "homem-procura-mulher": {
        label: "Homem procura mulher",
        filters: [
            { name: "Idade", type: "range", key: "age", min: 18, max: 70, step: 1, unit: "anos" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "mulher-procura-mulher": {
        label: "Mullher procura mulher",
        filters: [
            { name: "Idade", type: "range", key: "age", min: 18, max: 70, step: 1, unit: "anos" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "homem-procura-homem": {
        label: "Homem procura homem",
        filters: [
            { name: "Idade", type: "range", key: "age", min: 18, max: 70, step: 1, unit: "anos" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    },
    "encontros": {
        label: "Encontros casuais",
        filters: [
            { name: "Idade", type: "range", key: "age", min: 18, max: 70, step: 1, unit: "anos" },
            { name: "Com fotos", type: "checkbox", key: "has_photos" }
        ]
    }
};

export const CATEGORY_GROUP_MAP: Record<string, string> = {
    // Relacionamento
    "acompanhantes": "Relacionamento",
    "acompanhantes-trans": "Relacionamento",
    "acompanhantes-masculinos": "Relacionamento",
    "amizade": "Relacionamento",
    "namoro": "Relacionamento",
    "mulher-procura-homem": "Relacionamento",
    "homem-procura-mulher": "Relacionamento",
    "mulher-procura-mulher": "Relacionamento",
    "homem-procura-homem": "Relacionamento",
    "encontros": "Relacionamento",

    // Agronegócios / Animais
    "animais-estimacao-venda": "Animais estimação",
    "adocao-animais": "Animais estimação",
    "servicos-animais": "Animais estimação",

    // Veículos
    "carros-usados": "Veículos",
    "motos-scooters": "Veículos",
    "caminhoes-comerciais": "Veículos",
    "onibus-venda": "Veículos",
    "barcos-lanchas": "Veículos",
    "caravanas-trailers": "Veículos",
    "pecas-acessorios": "Veículos",

    // Imóveis
    "alugar-casa-apartamento": "Imóveis",
    "comprar-imovel": "Imóveis",
    "aluguel-temporada": "Imóveis",
    "lancamentos-imobiliarios": "Imóveis",
    "garagens-venda": "Imóveis",
    "imoveis-exterior": "Imóveis",
    "aluguel-temporada-exterior": "Imóveis",
    "terrenos-exterior": "Imóveis",
    "pontos-comerciais": "Imóveis",
    "terrenos-venda": "Imóveis",
    "aluguel-quarto": "Imóveis",
    "troca-de-imoveis": "Imóveis",

    // Empregos
    "vagas-emprego": "Empregos",
    "estagios-trainee": "Empregos",
    "curriculos": "Empregos",
    "trabalho-em-casa": "Empregos",

    // Serviços
    "cuidador-idosos": "Serviços",
    "empregada-domestica": "Serviços",
    "servicos-domesticos": "Serviços",
    "babas": "Serviços",
    "servicos-informatica": "Serviços",
    "turismo": "Serviços",
    "traducoes": "Serviços",
    "mudancas-fretes": "Serviços",
    "profissionais-liberais": "Serviços",
    "reformas-manutencao": "Serviços",
    "saude-beleza": "Serviços",
    "esoterismo": "Serviços",
    "outros-servicos": "Serviços",
    "gastronomia": "Serviços",

    // Cursos
    "cursos-idiomas": "Cursos",
    "cursos-informatica": "Cursos",
    "cursos-profissionalizantes": "Cursos",
    "aulas-particulares": "Cursos",
    "esportes-danca": "Cursos",
    "musica-teatro": "Cursos",
    "outros-cursos": "Cursos",

    // Compra venda (Para a sua casa / Lazer etc merged to match generalized groups usually or kept separate)
    // The user wants "Categorias iguais a que tu colocou no drop do criador"
    // In PostAdPage I used: "Para a sua casa", "Moda e beleza", "Multimédia", "Lazer"
    // Let's stick to those keys for consistency if I want EXACT match.
    // But HeroSection had "Compra venda".
    // I will use the KEYS from PostAdPage map I created earlier.

    "moveis-decoracao": "Para a sua casa",
    "utilidades-domesticas": "Para a sua casa",
    "eletrodomesticos": "Para a sua casa",
    "outros-produtos": "Para a sua casa",

    "joias-relogios": "Moda e beleza",
    "roupas-calcados": "Moda e beleza",
    "beleza-saude": "Moda e beleza",

    "celulares-acessorios": "Multimédia & Eletrónicos",
    "computadores-perifericos": "Multimédia & Eletrónicos",
    "equipamentos-profissionais": "Multimédia & Eletrónicos",

    "games-livros-filmes": "Lazer e Hobbies",
    "colecionaveis": "Lazer e Hobbies",
    "esportes-lazer": "Lazer e Hobbies",
    "artesanato": "Lazer e Hobbies",
    "presentes": "Lazer e Hobbies",
    "instrumentos-musicais": "Lazer e Hobbies",
};
