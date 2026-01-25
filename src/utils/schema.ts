/**
 * Schema.org JSON-LD Generation Utilities
 * Creates structured data for search engines
 */

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

/**
 * Generate Service + LocalBusiness schema for advert pages
 */
export function generateServiceSchema(
    ad: any,
    normalizedCity: string,
    serviceLabel: string,
    shortDescription: string,
    priceRange: string | null
) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: ad.title,
        description: shortDescription
    };

    // Only add areaServed if we have a valid city (not the fallback)
    if (normalizedCity !== 'Santa Catarina') {
        schema.areaServed = {
            '@type': 'City',
            name: normalizedCity
        };
    }

    // Provider (LocalBusiness)
    const provider: any = {
        '@type': 'LocalBusiness',
        name: ad.title,
        address: {
            '@type': 'PostalAddress',
            addressLocality: normalizedCity,
            addressRegion: 'SC',
            addressCountry: 'BR'
        }
    };

    // Add priceRange to LocalBusiness (not to Offer)
    if (priceRange) {
        provider.priceRange = priceRange;
    }

    schema.provider = provider;

    return schema;
}

/**
 * Generate ItemList schema for category pages
 */
export function generateItemListSchema(categoryName: string, ads: any[], categorySlug: string) {
    // Limit to first 20 items
    const limitedAds = ads.slice(0, 20);

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${categoryName} em Santa Catarina`,
        itemListElement: limitedAds.map((ad, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://www.floripalocal.com/anuncio/${ad.id}`,
            name: ad.title
        }))
    };
}
