import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Re-create __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Build the full path to service.json
const filePath = join(__dirname, 'dataBase', 'service.json');

// Ensure the directory exists
mkdirSync(dirname(filePath), { recursive: true });

// Write the file from the environment variable
writeFileSync(filePath, process.env.GCLOUD_SERVICE_JSON);

console.log('✅ service.json file created successfully.');
