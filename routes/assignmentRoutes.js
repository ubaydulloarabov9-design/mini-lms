const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { isLoggedIn, isTeacher } = require('../middlewares/authMiddleware');
const { uploadAssignmentFile } = require('../middlewares/uploadMiddleware');

router.get('/assignments', isLoggedIn, assignmentController.listAssignments);
router.post('/teacher/assignments', isLoggedIn, isTeacher, uploadAssignmentFile.single('file'), assignmentController.createAssignment);
router.post('/teacher/assignments/:id/update', isLoggedIn, isTeacher, uploadAssignmentFile.single('file'), assignmentController.updateAssignment);
router.post('/teacher/assignments/:id/delete', isLoggedIn, isTeacher, assignmentController.deleteAssignment);
router.get('/teacher/assignments/:id/submissions', isLoggedIn, isTeacher, assignmentController.viewSubmissions);

module.exports = router;
