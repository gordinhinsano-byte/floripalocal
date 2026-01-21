import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!connectionString) {
    console.error("❌ SUPABASE_DB_URL (ou DATABASE_URL) não definido no ambiente.");
    process.exit(1);
}

const sql = postgres(connectionString);

async function run() {
    try {
        console.log("Conectando ao banco de dados...");
        
        // Read SQL file
        const sqlFilePath = path.join(process.cwd(), 'supabase', 'setup_favorites.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("Executando script SQL de favoritos...");
        
        // Execute SQL
        await sql.unsafe(sqlContent);

        console.log("✅ Tabela de favoritos e permissões configuradas com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao configurar favoritos:", error);
    } finally {
        await sql.end();
    }
}

run();
