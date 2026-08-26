const jwt = require('jsonwebtoken');
require('dotenv').config();

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = req.user; // EJS shablonlarida ishlatish uchun
    next();
  } catch {
    return res.redirect('/login');
  }
}

function isTeacher(req, res, next) {
  if (req.user.role !== 'teacher') return res.status(403).send('Ruxsat yo\'q: faqat o\'qituvchi uchun');
  next();
}

function isStudent(req, res, next) {
  if (req.user.role !== 'student') return res.status(403).send('Ruxsat yo\'q: faqat talaba uchun');
  next();
}

module.exports = { isLoggedIn, isTeacher, isStudent };
