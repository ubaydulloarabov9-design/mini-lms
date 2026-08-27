const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

async function renderSettings(req, res, extra = {}) {
  const settings = await db.get('SELECT subject_name FROM settings WHERE id = 1');
  const currentUser = await db.get('SELECT full_name, email FROM users WHERE id = ?', [req.user.id]);

  // Agar cookie'dagi foydalanuvchi bazada topilmasa (masalan, eski/yaroqsiz sessiya) -
  // xato bilan qulash o'rniga xavfsiz tarzda login sahifasiga qaytaramiz
  if (!currentUser) {
    res.clearCookie('token');
    return res.redirect('/login');
  }

  res.render('settings', {
    active: 'settings',
    subjectNameValue: settings.subject_name,
    profileFullName: currentUser.full_name,
    profileEmail: currentUser.email,
    error: null,
    success: null,
    ...extra
  });
}

async function showSettings(req, res) {
  await renderSettings(req, res);
}

// Foydalanuvchi o'z ismi va loginini (email) o'zgartirishi
async function updateProfile(req, res) {
  const { full_name, email } = req.body;

  const existing = await db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
  if (existing) {
    return renderSettings(req, res, { error: 'Bu email allaqachon boshqa foydalanuvchi tomonidan band qilingan' });
  }

  await db.run('UPDATE users SET full_name = ?, email = ? WHERE id = ?', [full_name, email, req.user.id]);

  // JWT token ichida eski ism saqlangani uchun uni yangilab, cookie'ni qayta o'rnatamiz
  const token = jwt.sign(
    { id: req.user.id, role: req.user.role, full_name },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.cookie('token', token, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 });
  req.user.full_name = full_name;

  await renderSettings(req, res, { success: "Profil ma'lumotlari yangilandi" });
}

// Fan nomini o'zgartirish (faqat o'qituvchi)
async function updateSubject(req, res) {
  const { subject_name } = req.body;
  await db.run('UPDATE settings SET subject_name = ? WHERE id = 1', [subject_name]);
  await renderSettings(req, res, { success: 'Fan nomi yangilandi' });
}

module.exports = { showSettings, updateProfile, updateSubject };
