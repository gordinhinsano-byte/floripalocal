import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import "dotenv/config";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "Missing env vars. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example)."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    console.error("CSV parse errors:", parsed.errors);
    process.exit(1);
  }
  return parsed.data;
}

async function upsertCategories(rows) {
  if (!rows.length) return;
  const payload = rows.map((r) => ({
    slug: String(r.slug).trim(),
    label: String(r.label).trim(),
    group_name: r.group_name ? String(r.group_name).trim() : null,
    kind: r.kind ? String(r.kind).trim() : "produto",
  }));

  const { error } = await supabase.from("categories").upsert(payload, { onConflict: "slug" });
  if (error) throw error;
  console.log(`✓ categories upserted: ${payload.length}`);
}

async function upsertAttributeDefinitions(rows) {
  if (!rows.length) return;
  const payload = rows.map((r) => {
    const cfg = r.config_json ? JSON.parse(r.config_json) : {};
    return {
      category_slug: String(r.category_slug).trim(),
      key: String(r.key).trim(),
      label: String(r.label).trim(),
      ui: String(r.ui).trim(),
      value_type: String(r.value_type).trim(),
      config: cfg,
      filterable: r.filterable === "false" ? false : true,
    };
  });

  const { error } = await supabase
    .from("attribute_definitions")
    .upsert(payload, { onConflict: "category_slug,key" });
  if (error) throw error;
  console.log(`✓ attribute_definitions upserted: ${payload.length}`);
}

async function main() {
  const root = process.cwd();
  const categoriesCsv = path.join(root, "data", "categories.csv");
  const attrsCsv = path.join(root, "data", "attribute_definitions.csv");

  if (!fs.existsSync(categoriesCsv) || !fs.existsSync(attrsCsv)) {
    console.error(
      "Missing data files. Create data/categories.csv and data/attribute_definitions.csv (see data/templates)."
    );
    process.exit(1);
  }

  const categories = readCsv(categoriesCsv);
  const attrs = readCsv(attrsCsv);

  await upsertCategories(categories);
  await upsertAttributeDefinitions(attrs);

  console.log("\nDone. Filters will start coming from Supabase where available.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
