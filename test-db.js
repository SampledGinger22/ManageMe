import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create database
const dbPath = path.join(process.cwd(), 'test.db');
console.log('Creating database at:', dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Read and execute schema
const schemaPath = path.join(process.cwd(), 'src/database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('Database created successfully!');

// Test query
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables created:', tables.map(t => t.name).join(', '));

db.close();
console.log('Test complete!');