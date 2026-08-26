const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn, isTeacher, isStudent } = require('../middlewares/authMiddleware');

router.get('/teacher/dashboard', isLoggedIn, isTeacher, userController.teacherDashboard);
router.get('/student/dashboard', isLoggedIn, isStudent, userController.studentDashboard);
router.get('/teacher/students', isLoggedIn, isTeacher, userController.listStudents);

module.exports = router;
