const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'lms.db');
const sqlite = new sqlite3.Database(dbPath);

// Promise wrapper - sqlite3 callback uslubini async/await ga o'giramiz
const db = {
  run: (sql, params = []) =>
    new Promise((resolve, reject) => {
      sqlite.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve(this); // this.lastID, this.changes
      });
    }),
  get: (sql, params = []) =>
    new Promise((resolve, reject) => {
      sqlite.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    }),
  all: (sql, params = []) =>
    new Promise((resolve, reject) => {
      sqlite.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
    })
};

async function initDb() {
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('teacher','student')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    deadline DATETIME NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    text_answer TEXT,
    file_path TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    grade INTEGER,
    feedback TEXT,
    graded_at DATETIME,
    graded_by INTEGER REFERENCES users(id),
    UNIQUE(assignment_id, student_id)
  )`);

  // Tizim sozlamalari (fan nomi va h.k.) - bitta qatorli jadval
  await db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    subject_name TEXT NOT NULL DEFAULT 'Fan nomi'
  )`);
  await db.run(`INSERT OR IGNORE INTO settings (id, subject_name) VALUES (1, 'Fan nomi')`);

  console.log('✅ Ma\'lumotlar bazasi jadvallari tayyor');
}

module.exports = { db, initDb };
