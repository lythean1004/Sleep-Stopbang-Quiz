import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'backend/data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'stopbang.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encrypted_name TEXT NOT NULL,
  encrypted_phone TEXT NOT NULL,
  encrypted_city TEXT NOT NULL,
  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consent_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER,
  required_consent INTEGER NOT NULL,
  marketing_consent INTEGER NOT NULL,
  consent_text_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(lead_id) REFERENCES leads(id)
);
`);

export default db;
