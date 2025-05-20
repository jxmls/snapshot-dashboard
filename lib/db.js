const Database = require('better-sqlite3');
const path = require('path');

// Use /tmp for writable SQLite storage on Render
const dbPath = path.join('/tmp', 'snapshot-reports.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

module.exports = db;
