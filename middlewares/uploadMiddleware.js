const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ALLOWED_EXT = ['.pdf', '.docx', '.zip'];

// UPLOADS_DIR muhit o'zgaruvchisi orqali sozlanadi (Render'dagi doimiy disk uchun,
// masalan /var/data/uploads). Agar berilmasa, loyiha ichidagi 'uploads' papkasi ishlatiladi.
const UPLOADS_ROOT = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');

function makeStorage(subfolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(UPLOADS_ROOT, subfolder);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const unique = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, unique);
    }
  });
}

function submissionFileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) return cb(new Error('Faqat .pdf, .docx yoki .zip formatlariga ruxsat bor'));
  cb(null, true);
}

const uploadMaterial = multer({ storage: makeStorage('materials') });
const uploadAssignmentFile = multer({ storage: makeStorage('assignments') });
const uploadSubmission = multer({
  storage: makeStorage('submissions'),
  fileFilter: submissionFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

module.exports = { uploadMaterial, uploadAssignmentFile, uploadSubmission };
