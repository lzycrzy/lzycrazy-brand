import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'dataBase', 'service.json');

fs.mkdirSync(path.dirname(filePath), { recursive: true });

fs.writeFileSync(filePath, process.env.GCLOUD_SERVICE_JSON);

console.log('✅ service.json file created.');
