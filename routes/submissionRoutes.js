const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { isLoggedIn, isStudent, isTeacher } = require('../middlewares/authMiddleware');
const { uploadSubmission } = require('../middlewares/uploadMiddleware');

router.post('/student/assignments/:id/submit', isLoggedIn, isStudent, uploadSubmission.single('file'), submissionController.submitAssignment);
router.post('/teacher/submissions/:id/grade', isLoggedIn, isTeacher, submissionController.gradeSubmission);
router.get('/student/my-grades', isLoggedIn, isStudent, submissionController.myGrades);

module.exports = router;
