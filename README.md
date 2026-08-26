# Mini-LMS — Ishga tushirish qo'llanmasi

## 1. Talablar
- Node.js (v18 yoki undan yuqori) o'rnatilgan bo'lishi kerak

## 2. O'rnatish
```bash
cd mini-lms
npm install
```

## 3. Ishga tushirish
```bash
npm start
```
Server ishga tushgach, brauzerda oching: **http://localhost:3000**

## 4. Birinchi marta ishlatish
- `.env` faylida `JWT_SECRET` qiymatini o'zingizniki bilan almashtiring.
- O'qituvchi hisobi tizimda ro'yxatdan o'tish orqali yaratilmaydi (xavfsizlik uchun) — uni quyidagi skript bilan qo'lda yarating:

```bash
node -e "
const bcrypt = require('bcrypt');
const { db, initDb } = require('./config/db');
(async () => {
  await initDb();
  const hash = await bcrypt.hash('SIZNING_PAROLINGIZ', 10);
  await db.run(\"INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'teacher')\", ['Ismingiz', 'email@example.com', hash]);
  console.log('Yaratildi');
  process.exit(0);
})();
"
```

- Talabalar esa `/register` sahifasi orqali o'zlari ro'yxatdan o'ta oladi (avtomatik ravishda "student" roli beriladi).

## 5. Papka tuzilmasi
Barcha kod arxitektura hujjatidagi tuzilmaga mos: `controllers/`, `models` o'rniga to'g'ridan-to'g'ri `config/db.js` orqali so'rovlar, `routes/`, `views/` (EJS), `public/` (statik fayllar), `uploads/` (yuklangan fayllar).

## 6. Muammolarni bartaraf etish
- **`Cannot find module`** — `npm install` bajarilmagan, uni qayta ishga tushiring.
- **`EADDRINUSE`** — 3000-port band, `.env` faylida `PORT` qiymatini o'zgartiring.
- **Fayl yuklanmayapti** — `uploads/` papkasi va ichidagi `materials/assignments/submissions` papkalari mavjudligini tekshiring (avtomatik yaratiladi, lekin ruxsat muammosi bo'lishi mumkin).
