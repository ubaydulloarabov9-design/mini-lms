const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const { initDb } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const setupRoutes = require('./routes/setupRoutes');
const { isLoggedIn } = require('./middlewares/authMiddleware');
const { attachSettings } = require('./middlewares/settingsMiddleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(attachSettings);

// Bosh sahifa -> rolga qarab dashboardga yo'naltirish
app.get('/', isLoggedIn, (req, res) => {
  res.redirect(req.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
});

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', materialRoutes);
app.use('/', assignmentRoutes);
app.use('/', submissionRoutes);
app.use('/', settingsRoutes);
app.use('/', setupRoutes);

// 404
app.use((req, res) => res.status(404).send('Sahifa topilmadi'));

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
  });
});
