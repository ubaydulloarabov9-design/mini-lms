const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { isLoggedIn, isTeacher } = require('../middlewares/authMiddleware');
const { uploadMaterial } = require('../middlewares/uploadMiddleware');

router.get('/materials', isLoggedIn, materialController.listMaterials);
router.post('/teacher/materials', isLoggedIn, isTeacher, uploadMaterial.single('file'), materialController.createMaterial);
router.post('/teacher/materials/:id/update', isLoggedIn, isTeacher, materialController.updateMaterial);
router.post('/teacher/materials/:id/delete', isLoggedIn, isTeacher, materialController.deleteMaterial);

module.exports = router;
