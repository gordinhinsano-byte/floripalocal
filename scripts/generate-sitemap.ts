/**
 * Sitemap Generation Script
 * Generates public/sitemap.xml with all active listings and categories
 * 
 * Usage: npm run generate-sitemap
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env
config();

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Missing Supabase credentials in environment variables');
    console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Listing {
    id: string;
    created_at: string;
}

interface Category {
    slug: string;
    updated_at?: string;
    created_at: string;
}

async function generateSitemap() {
    console.log('🚀 Starting sitemap generation...\n');

    try {
        // Fetch all active listings
        console.log('📋 Fetching active listings...');
        const { data: listings, error: listingsError } = await supabase
            .from('listings')
            .select('id, created_at')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (listingsError) {
            throw new Error(`Failed to fetch listings: ${listingsError.message}`);
        }

        console.log(`✅ Found ${listings?.length || 0} active listings\n`);

        // Fetch all categories
        console.log('📂 Fetching categories...');
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('slug, updated_at, created_at')
            .order('slug');

        if (categoriesError) {
            throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
        }

        console.log(`✅ Found ${categories?.length || 0} categories\n`);

        // Generate XML
        console.log('🔨 Generating XML...');
        const baseUrl = 'https://www.floripalocal.com';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add homepage
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';

        // Add listings
        for (const listing of listings || []) {
            const lastmod = listing.created_at.split('T')[0];
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/anuncio/${listing.id}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        }

        // Add categories
        for (const category of categories || []) {
            const lastmod = (category.updated_at || category.created_at).split('T')[0];
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/c/${category.slug}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += '    <changefreq>daily</changefreq>\n';
            xml += '    <priority>0.9</priority>\n';
            xml += '  </url>\n';
        }

        xml += '</urlset>';

        // Write to public/sitemap.xml
        const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, xml, 'utf8');

        console.log(`✅ Sitemap generated successfully!\n`);
        console.log(`📍 Location: ${sitemapPath}`);
        console.log(`📊 Total URLs: ${1 + (listings?.length || 0) + (categories?.length || 0)}`);
        console.log(`   - Homepage: 1`);
        console.log(`   - Listings: ${listings?.length || 0}`);
        console.log(`   - Categories: ${categories?.length || 0}\n`);

        console.log('💡 Next steps:');
        console.log('   1. Deploy the sitemap to production');
        console.log('   2. Ping Google: https://www.google.com/ping?sitemap=https://www.floripalocal.com/sitemap.xml');
        console.log('   3. Submit to Google Search Console\n');

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

// Run the script
generateSitemap();
