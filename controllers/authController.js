const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
require('dotenv').config();

function showLogin(req, res) {
  res.render('auth/login', { error: null });
}

function showRegister(req, res) {
  res.render('auth/register', { error: null });
}

async function register(req, res) {
  const { full_name, email, password } = req.body;
  try {
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.render('auth/register', { error: "Bu email allaqachon ro'yxatdan o'tgan" });

    const password_hash = await bcrypt.hash(password, 10);
    await db.run(
      `INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'student')`,
      [full_name, email, password_hash]
    );
    res.redirect('/login');
  } catch (err) {
    res.render('auth/register', { error: 'Xatolik yuz berdi: ' + err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) return res.render('auth/login', { error: "Email yoki parol noto'g'ri" });

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return res.render('auth/login', { error: "Email yoki parol noto'g'ri" });

  const token = jwt.sign(
    { id: user.id, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.cookie('token', token, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 });
  res.redirect(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
}

function logout(req, res) {
  res.clearCookie('token');
  res.redirect('/login');
}

module.exports = { showLogin, showRegister, register, login, logout };
