const bcrypt = require('bcrypt');
const { db } = require('../config/db');

function showSetupForm(req, res) {
  res.render('setup', { error: null, success: null });
}

async function createTeacherAccount(req, res) {
  const { full_name, email, password } = req.body;

  try {
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.render('setup', { error: 'Bu email allaqachon mavjud', success: null });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await db.run(
      `INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'teacher')`,
      [full_name, email, password_hash]
    );

    res.render('setup', { error: null, success: `O'qituvchi hisobi yaratildi: ${email}` });
  } catch (err) {
    res.render('setup', { error: 'Xatolik: ' + err.message, success: null });
  }
}

module.exports = { showSetupForm, createTeacherAccount };
