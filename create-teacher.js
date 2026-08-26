const bcrypt = require('bcrypt');
const { db, initDb } = require('./config/db');

async function main() {
  await initDb();

  const full_name = 'Test Domla';
  const email = 'teacher@test.uz';
  const password = 'teacher123';

  const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    console.log('Bu email bilan foydalanuvchi allaqachon mavjud:', email);
    console.log('Roli:', (await db.get('SELECT role FROM users WHERE email = ?', [email])).role);
    process.exit(0);
  }

  const password_hash = await bcrypt.hash(password, 10);
  await db.run(
    `INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'teacher')`,
    [full_name, email, password_hash]
  );

  console.log('✅ O\'qituvchi yaratildi!');
  console.log('Email:', email);
  console.log('Parol:', password);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Xatolik:', err.message);
  process.exit(1);
});
