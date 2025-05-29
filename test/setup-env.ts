import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envTestPath = path.resolve(__dirname, '../.env.test');

if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath });
}
