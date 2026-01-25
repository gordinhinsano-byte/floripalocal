/**
 * Category-specific intro texts for SEO
 * Uses hash-based rotation to ensure uniqueness between categories
 */

/**
 * Generate a simple hash from a string
 */
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Intro text variations (120-150 words each)
 */
const introVariations = [
    (catName: string) => `Encontre os melhores anúncios de ${catName} em Santa Catarina. Nossa plataforma conecta você a milhares de ofertas verificadas em todo o estado. Navegue por anúncios atualizados diariamente, compare preços e encontre exatamente o que procura. Com filtros avançados, você pode refinar sua busca por localização, faixa de preço e características específicas. Seja você um comprador ou vendedor, facilitamos negociações seguras e transparentes. Descubra oportunidades únicas e feche o melhor negócio hoje mesmo.`,

    (catName: string) => `Procurando por ${catName} em Santa Catarina? Você está no lugar certo. Aqui você encontra uma seleção completa de anúncios de qualidade de toda a região. Nossa plataforma oferece ferramentas de busca intuitivas que permitem filtrar resultados por cidade, bairro e preferências pessoais. Todos os dias, novos anúncios são publicados por pessoas da sua comunidade. Aproveite para explorar as melhores ofertas disponíveis e encontre o que você precisa de forma rápida e confiável. Economize tempo e dinheiro pesquisando em um só lugar.`,

    (catName: string) => `Explore uma ampla variedade de ${catName} disponíveis em Santa Catarina. Nossa comunidade ativa publica centenas de anúncios semanalmente, garantindo que você sempre tenha acesso às ofertas mais recentes. Utilize nossos filtros personalizados para encontrar exatamente o que procura, desde opções econômicas até alternativas premium. Conecte-se diretamente com vendedores da sua região e negocie com segurança. Seja para comprar, vender ou simplesmente pesquisar, nossa plataforma facilita cada etapa do processo. Comece sua busca agora.`,

    (catName: string) => `Anúncios de ${catName} em Santa Catarina são atualizados constantemente em nossa plataforma. Aqui você encontra ofertas de particulares e profissionais de todo o estado. Nossa interface permite que você pesquise de forma eficiente, economizando tempo precioso. Filtre por localização, preço e características específicas para encontrar a opção perfeita. Milhares de usuários confiam em nosso serviço para fazer negócios seguros todos os meses. Descubra por que somos a escolha preferida para classificados em Santa Catarina. Veja as ofertas disponíveis agora.`,

    (catName: string) => `Descubra os melhores ${catName} em Santa Catarina através de nossa plataforma consolidada. Reunimos anúncios de todas as cidades do estado para facilitar sua pesquisa. Com recursos de busca avançada, você pode encontrar ofertas que atendam exatamente suas necessidades e orçamento. Nossa comunidade ativa garante que sempre  haja novidades para explorar. Seja você um comprador experiente ou iniciante, oferecemos uma experiência de navegação simples e eficaz. Conecte-se com vendedores confiáveis e faça o negócio que procura. Comece sua jornada hoje.`,

    (catName: string) => `Navegue por ${catName} em Santa Catarina e encontre as melhores oportunidades da região. Nossa plataforma reúne milhares de anúncios organizados para sua conveniência. Use filtros inteligentes para refinar resultados por localização, faixa de preço e outras preferências. Publicamos diariamente novos anúncios de vendedores locais verificados. Aqui você negocia diretamente com o anunciante, sem intermediários ou taxas ocultas. Economize tempo pesquisando em um só lugar e compare diferentes ofertas facilmente. Encontre o que você precisa com rapidez e segurança.`,

    (catName: string) => `Procure por ${catName} em Santa Catarina e encontre opções de qualidade perto de você. Nossa plataforma oferece uma experiência de busca personalizada, permitindo que você filtre resultados de acordo com suas preferências. Anúncios novos são adicionados todos os dias por membros da nossa comunidade. Seja para comprar, vender ou pesquisar preços, você está no lugar certo. Utilizamos ferramentas modernas para garantir que sua navegação seja rápida e eficiente. Conecte-se com vendedores da sua região e feche negócios com confiança. Explore as ofertas agora.`,

    (catName: string) => `Encontre ${catName} em Santa Catarina com facilidade usando nossa plataforma intuitiva. Oferecemos uma seleção abrangente de anúncios atualizados regularmente. Nossos filtros avançados permitem que você refine sua busca por cidade, bairro, preço e muito mais. Milhares de pessoas usam nosso serviço para comprar e vender com segurança todos os meses. Aqui você tem acesso direto aos anunciantes, facilitando a negociação. Economize tempo e encontre o que procura em poucos cliques. Veja as ofertas disponíveis e faça seu negócio hoje.`,

    (catName: string) => `Os melhores anúncios de ${catName} em Santa Catarina estão aqui. Nossa plataforma conecta compradores e vendedores de forma rápida e segura. Utilize nossos recursos de busca para encontrar ofertas que atendam suas necessidades específicas. Novos anúncios são publicados diariamente por usuários verificados de todo o estado. Seja você um comprador ou vendedor, oferecemos as ferramentas necessárias para fechar o melhor negócio. Navegue por categorias organizadas e descubra oportunidades únicas. Comece sua pesquisa agora e encontre exatamente o que procura com facilidade.`,

    (catName: string) => `Explore ${catName} em Santa Catarina e descubra ofertas incríveis todos os dias. Nossa plataforma reúne anúncios de particulares e profissionais em um só lugar. Com filtros personalizados, você pode encontrar exatamente o que precisa de forma rápida. Conecte-se com vendedores da sua região e negocie diretamente, sem intermediários. Milhares de usuários confiam em nosso serviço para fazer negócios seguros. Atualizamos nossa base de dados constantemente para garantir que você tenha acesso às ofertas mais recentes. Encontre o que você procura com rapidez e confiança.`
];

/**
 * Get unique intro text for a category based on slug
 * Uses hash to ensure different categories get different texts
 */
export function getCategoryIntroText(categorySlug: string, categoryName: string): string {
    const hash = simpleHash(categorySlug);
    const index = hash % introVariations.length;
    return introVariations[index](categoryName);
}
