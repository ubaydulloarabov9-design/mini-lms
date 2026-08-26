const { db } = require('../config/db');

async function submitAssignment(req, res) {
  const { id: assignment_id } = req.params;
  const { text_answer } = req.body;
  const student_id = req.user.id;

  const assignment = await db.get('SELECT deadline FROM assignments WHERE id = ?', [assignment_id]);
  if (!assignment) return res.status(404).send('Topshiriq topilmadi');

  if (new Date() > new Date(assignment.deadline)) {
    return res.status(400).send('Muddat tugagan, topshiriq qabul qilinmaydi');
  }

  const file_path = req.file ? `/uploads/submissions/${req.file.filename}` : null;

  await db.run(
    `INSERT INTO submissions (assignment_id, student_id, text_answer, file_path)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(assignment_id, student_id)
     DO UPDATE SET text_answer=excluded.text_answer, file_path=excluded.file_path, submitted_at=CURRENT_TIMESTAMP`,
    [assignment_id, student_id, text_answer || null, file_path]
  );

  res.redirect('/assignments');
}

async function gradeSubmission(req, res) {
  const { id: submission_id } = req.params;
  const { grade, feedback } = req.body;

  await db.run(
    `UPDATE submissions SET grade = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP, graded_by = ? WHERE id = ?`,
    [grade, feedback, req.user.id, submission_id]
  );

  res.redirect('back');
}

async function myGrades(req, res) {
  const grades = await db.all(
    `SELECT s.*, a.title AS assignment_title FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     WHERE s.student_id = ? ORDER BY s.submitted_at DESC`,
    [req.user.id]
  );
  res.render('student/my-grades', { grades, active: 'grades' });
}

module.exports = { submitAssignment, gradeSubmission, myGrades };
