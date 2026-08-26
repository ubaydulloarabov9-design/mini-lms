const { db } = require('../config/db');

// Har bir sahifada topbar'da fan nomini ko'rsatish uchun uni res.locals ga yuklaymiz
async function attachSettings(req, res, next) {
  try {
    const settings = await db.get('SELECT subject_name FROM settings WHERE id = 1');
    res.locals.subjectName = settings ? settings.subject_name : 'Fan nomi';
  } catch {
    res.locals.subjectName = 'Fan nomi';
  }
  next();
}

module.exports = { attachSettings };
