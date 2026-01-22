
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to read .env file manually if variables are not set
if (!process.env.SUPABASE_DB_URL && !process.env.DATABASE_URL) {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, '');
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        // ignore
    }
}

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ SUPABASE_DB_URL (ou DATABASE_URL) não definido. Certifique-se de ter um arquivo .env com essa variável.");
    process.exit(1);
}

const sql = postgres(connectionString);

async function run() {
    try {
        console.log("Conectando ao banco de dados...");
        
        const sqlFilePath = path.join(process.cwd(), 'supabase', 'add_stats_columns.sql');
        console.log(`Lendo arquivo SQL: ${sqlFilePath}`);
        
        if (!fs.existsSync(sqlFilePath)) {
            throw new Error(`Arquivo SQL não encontrado: ${sqlFilePath}`);
        }

        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("Executando script SQL...");
        
        // Split commands if necessary or just run unsafe
        // unsafe allows running multiple statements
        await sql.unsafe(sqlContent);

        console.log("✅ Colunas de estatísticas adicionadas com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao executar script:", error);
    } finally {
        await sql.end();
    }
}

run();
