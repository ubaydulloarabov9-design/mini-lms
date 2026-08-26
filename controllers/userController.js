const { db } = require('../config/db');

async function teacherDashboard(req, res) {
  const materialsCount = (await db.get('SELECT COUNT(*) AS c FROM materials')).c;
  const assignmentsCount = (await db.get('SELECT COUNT(*) AS c FROM assignments')).c;
  const studentsCount = (await db.get("SELECT COUNT(*) AS c FROM users WHERE role='student'")).c;
  const ungradedCount = (await db.get('SELECT COUNT(*) AS c FROM submissions WHERE grade IS NULL')).c;
  res.render('teacher/dashboard', { materialsCount, assignmentsCount, studentsCount, ungradedCount, active: 'dashboard' });
}

async function studentDashboard(req, res) {
  const materialsCount = (await db.get('SELECT COUNT(*) AS c FROM materials')).c;
  const pendingCount = (await db.get(
    `SELECT COUNT(*) AS c FROM assignments a
     WHERE NOT EXISTS (SELECT 1 FROM submissions s WHERE s.assignment_id = a.id AND s.student_id = ?)`,
    [req.user.id]
  )).c;
  const gradesCount = (await db.get(
    'SELECT COUNT(*) AS c FROM submissions WHERE student_id = ? AND grade IS NOT NULL',
    [req.user.id]
  )).c;
  res.render('student/dashboard', { materialsCount, pendingCount, gradesCount, active: 'dashboard' });
}

async function listStudents(req, res) {
  const students = await db.all("SELECT id, full_name, email, created_at FROM users WHERE role='student' ORDER BY full_name");
  res.render('teacher/students', { students, active: 'students' });
}

module.exports = { teacherDashboard, studentDashboard, listStudents };
