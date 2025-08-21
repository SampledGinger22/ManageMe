import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || './manageme.db';
    const dbExists = fs.existsSync(dbPath);
    
    console.log(`Using database at: ${path.resolve(dbPath)}`);
    
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    // Initialize schema
    initializeSchema();
    
    // Seed data if new database
    if (!dbExists) {
      console.log('New database detected, seeding initial data...');
      seedDatabase();
    }
  }
  
  return db;
}

function initializeSchema() {
  const schemaPath = path.join(process.cwd(), 'src', 'database', 'schema.sql');
  
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db!.exec(schema);
    console.log('Database schema initialized');
  } else {
    console.error('Schema file not found at:', schemaPath);
  }
}

function seedDatabase() {
  const database = getDatabase();
  
  try {
    // Create default admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    const userStmt = database.prepare(
      'INSERT OR IGNORE INTO users (username, password_hash, theme_preference) VALUES (?, ?, ?)'
    );
    userStmt.run('admin', hashedPassword, 'dark');
    
    // Create sample team
    const teamStmt = database.prepare(
      'INSERT OR IGNORE INTO teams (name, description, color) VALUES (?, ?, ?)'
    );
    const teamResult = teamStmt.run('Engineering', 'Product Engineering Team', '#1890ff');
    
    // Create sample people
    const peopleStmt = database.prepare(`
      INSERT OR IGNORE INTO people (
        name, job_title, team_id, email, phone, 
        country, primary_language, communication_style,
        english_verbal_proficiency, english_written_proficiency,
        timezone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    peopleStmt.run(
      'John Doe', 'Senior Engineer', teamResult.lastInsertRowid,
      'john.doe@example.com', '555-0101',
      'USA', 'English', 'Direct and concise',
      10, 10, 'America/New_York'
    );
    
    peopleStmt.run(
      'Jane Smith', 'Product Manager', teamResult.lastInsertRowid,
      'jane.smith@example.com', '555-0102',
      'USA', 'English', 'Collaborative and detailed',
      10, 10, 'America/New_York'
    );
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

export function initializeDatabase() {
  getDatabase();
}