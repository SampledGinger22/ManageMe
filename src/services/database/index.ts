import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (in project root)
const DB_PATH = path.join(process.cwd(), 'manageme.db');
const SCHEMA_PATH = path.join(__dirname, '../../database/schema.sql');

class DatabaseService {
  private db: Database.Database;

  constructor() {
    // Create database connection
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL'); // Better performance
    this.db.pragma('foreign_keys = ON'); // Enable foreign key constraints
    
    // Initialize schema
    this.initializeDatabase();
  }

  private initializeDatabase() {
    try {
      // Read and execute schema
      const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
      this.db.exec(schema);
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // Get database instance for direct queries
  getDb(): Database.Database {
    return this.db;
  }

  // Generic query methods
  all<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  get<T = any>(sql: string, params: any[] = []): T | undefined {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params) as T | undefined;
  }

  run(sql: string, params: any[] = []): Database.RunResult {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  // Transaction helper
  transaction<T>(fn: () => T): T {
    const transaction = this.db.transaction(fn);
    return transaction();
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

// Create singleton instance
let dbInstance: DatabaseService | null = null;

export function getDatabase(): DatabaseService {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
  }
  return dbInstance;
}

export default DatabaseService;