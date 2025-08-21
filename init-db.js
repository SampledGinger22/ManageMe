import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Initializing database...');

try {
  // Use npx tsx to run TypeScript directly
  execSync('npx tsx src/database/seed.ts', {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

console.log('Database initialized successfully!');