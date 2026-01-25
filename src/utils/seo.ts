/**
 * SEO Utility Functions
 * Handles data normalization, cleaning, and formatting for SEO purposes
 */

/**
 * Safely parse JSON strings, returning fallback on error
 */
export function safeJsonParse<T>(value: any, fallback: T): T {
    if (!value) return fallback;
    if (typeof value === 'object') return value as T;

    try {
        const parsed = JSON.parse(String(value));
        return parsed as T;
    } catch {
        return fallback;
    }
}

/**
 * Normalize city from buggy database fields
 * DB bug: city might be "SC", state might be "Santa CatarinaPalhoca"
 * Strategy: Extract city from state field or description as fallback
 */
export function normalizeCity(ad: any): string {
    // Try to extract from state field first (remove "Santa Catarina" prefix)
    if (ad.state && typeof ad.state === 'string') {
        const cleaned = ad.state
            .replace(/Santa\s*Catarina/gi, '')
            .replace(/\s*Estado/gi, '')
            .trim();

        if (cleaned && cleaned.length > 3 && cleaned !== 'SC') {
            return cleaned;
        }
    }

    // Try to extract from city field if it's not "SC"
    if (ad.city && typeof ad.city === 'string') {
        const city = ad.city.trim();
        if (city.length > 3 && city !== 'SC') {
            return city;
        }
    }

    // Try to extract from description (look for common city patterns)
    if (ad.description && typeof ad.description === 'string') {
        const commonCities = [
            'Florianópolis', 'Florianopolis',
            'Palhoça', 'Palhoca',
            'São José', 'Sao Jose',
            'Biguaçu', 'Biguacu',
            'Itajaí', 'Itajai',
            'Joinville',
            'Blumenau',
            'Chapecó', 'Chapeco',
            'Criciúma', 'Criciuma',
            'Jaraguá do Sul', 'Jaragua do Sul'
        ];

        for (const city of commonCities) {
            if (ad.description.includes(city)) {
                return city.replace(/ç/g, 'c').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/é/g, 'e');
            }
        }
    }

    // Fallback to generic
    return 'Santa Catarina';
}

/**
 * Get normalized region code (always "SC" for Santa Catarina)
 */
export function normalizeRegion(ad: any): string {
    return 'SC';
}

/**
 * Get full state name
 */
export function normalizeStateName(): string {
    return 'Santa Catarina';
}

/**
 * Clean title for SEO: remove emojis, excessive whitespace, limit length
 */
export function cleanTitle(title: string, maxLength: number = 60): string {
    if (!title) return '';

    return title
        // Remove emojis (basic unicode ranges)
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc symbols
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
        .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
        .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation selectors
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental symbols
        // Remove excessive decorative characters
        .replace(/[★●■▪▫◆◇○◉●]/g, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim()
        // Limit length (keep whole words)
        .substring(0, maxLength)
        .replace(/\s+\S*$/, '') // Remove partial word at end
        .trim();
}

/**
 * Extract first service from ad attributes for use in H1
 */
export function extractFirstService(ad: any): string {
    const services = safeJsonParse<string[]>(ad.attributes?.services, []);

    if (services.length > 0 && services[0]) {
        return services[0];
    }

    // Fallback to category name if available
    if (ad.categories?.name) {
        return ad.categories.name;
    }

    return 'Serviços';
}

/**
 * Generate short description for Schema.org (clean, no excessive formatting)
 */
export function generateShortDescription(description: string, maxLength: number = 200): string {
    if (!description) return '';

    return description
        // Remove decorative characters
        .replace(/[★●■▪▫◆◇○◉●]/g, '')
        // Remove excessive line breaks
        .replace(/\n+/g, ' ')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim()
        // Limit length
        .substring(0, maxLength)
        .replace(/\s+\S*$/, '') // Remove partial word
        .trim()
        + (description.length > maxLength ? '...' : '');
}

/**
 * Calculate price range from ad attributes (for Schema.org)
 * Returns formatted "R$ min – R$ max" or null if no valid prices
 */
export function calculatePriceRange(ad: any): string | null {
    const prices: number[] = [];

    // Collect all rate fields
    const rateFields = ['rate_30m', 'rate_1h', 'rate_2h', 'rate_3h', 'rate_overnight'];

    for (const field of rateFields) {
        const value = ad.attributes?.[field];
        if (value) {
            const num = typeof value === 'number' ? value : parseFloat(String(value));
            if (Number.isFinite(num) && num > 0) {
                prices.push(num);
            }
        }
    }

    // Also check main price field
    if (ad.price) {
        const num = typeof ad.price === 'number' ? ad.price : parseFloat(String(ad.price));
        if (Number.isFinite(num) && num > 0) {
            prices.push(num);
        }
    }

    if (prices.length === 0) return null;

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return `R$ ${min.toLocaleString('pt-BR')} – R$ ${max.toLocaleString('pt-BR')}`;
}
