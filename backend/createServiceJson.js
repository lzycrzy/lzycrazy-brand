import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, 'dataBase', 'service.json');

const jsonContent = process.env.GCLOUD_SERVICE_JSON;

if (!jsonContent) {
  console.error("❌ Environment variable GCLOUD_SERVICE_JSON is not defined!");
  process.exit(1); // Exit with failure
}

mkdirSync(dirname(filePath), { recursive: true });
writeFileSync(filePath, jsonContent);
console.log('✅ service.json file created successfully.');
