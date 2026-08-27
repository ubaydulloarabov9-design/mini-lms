const { db } = require('../config/db');

async function listMaterials(req, res) {
  const materials = await db.all('SELECT * FROM materials ORDER BY id ASC');
  const view = req.user.role === 'teacher' ? 'teacher/materials' : 'student/materials';
  res.render(view, { materials, active: 'materials' });
}

async function createMaterial(req, res) {
  const { title, description } = req.body;
  const file_path = req.file ? `/uploads/materials/${req.file.filename}` : null;
  await db.run(
    `INSERT INTO materials (title, description, file_path, created_by) VALUES (?, ?, ?, ?)`,
    [title, description, file_path, req.user.id]
  );
  res.redirect('/materials');
}

async function updateMaterial(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;
  await db.run(
    `UPDATE materials SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [title, description, id]
  );
  res.redirect('/materials');
}

async function deleteMaterial(req, res) {
  const { id } = req.params;
  await db.run('DELETE FROM materials WHERE id = ?', [id]);
  res.redirect('/materials');
}

module.exports = { listMaterials, createMaterial, updateMaterial, deleteMaterial };
