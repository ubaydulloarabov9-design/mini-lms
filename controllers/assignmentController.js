const { db } = require('../config/db');

async function listAssignments(req, res) {
  if (req.user.role === 'teacher') {
    const assignments = await db.all('SELECT * FROM assignments ORDER BY id ASC');
    return res.render('teacher/assignments', { assignments, active: 'assignments' });
  }

  // Talaba uchun - har bir topshiriqqa o'zining submission holatini qo'shamiz
  const assignments = await db.all('SELECT * FROM assignments ORDER BY id ASC');
  const submissions = await db.all('SELECT * FROM submissions WHERE student_id = ?', [req.user.id]);
  const merged = assignments.map(a => ({
    ...a,
    submission: submissions.find(s => s.assignment_id === a.id) || null
  }));
  res.render('student/assignments', { assignments: merged, active: 'assignments' });
}

async function createAssignment(req, res) {
  const { title, description, deadline } = req.body;
  const file_path = req.file ? `/uploads/assignments/${req.file.filename}` : null;
  await db.run(
    `INSERT INTO assignments (title, description, file_path, deadline, created_by) VALUES (?, ?, ?, ?, ?)`,
    [title, description, file_path, deadline, req.user.id]
  );
  res.redirect('/assignments');
}

async function updateAssignment(req, res) {
  const { id } = req.params;
  const { title, description, deadline } = req.body;
  await db.run(
    `UPDATE assignments SET title = ?, description = ?, deadline = ? WHERE id = ?`,
    [title, description, deadline, id]
  );
  res.redirect('/assignments');
}

async function deleteAssignment(req, res) {
  const { id } = req.params;
  await db.run('DELETE FROM assignments WHERE id = ?', [id]);
  res.redirect('/assignments');
}

async function viewSubmissions(req, res) {
  const { id } = req.params;
  const assignment = await db.get('SELECT * FROM assignments WHERE id = ?', [id]);
  const submissions = await db.all(
    `SELECT s.*, u.full_name FROM submissions s JOIN users u ON s.student_id = u.id WHERE s.assignment_id = ?`,
    [id]
  );
  res.render('teacher/grade-submission', { assignment, submissions, active: 'assignments' });
}

module.exports = { listAssignments, createAssignment, updateAssignment, deleteAssignment, viewSubmissions };
