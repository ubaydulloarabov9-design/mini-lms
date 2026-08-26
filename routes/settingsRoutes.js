const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { isLoggedIn, isTeacher } = require('../middlewares/authMiddleware');

router.get('/settings', isLoggedIn, settingsController.showSettings);
router.post('/settings/profile', isLoggedIn, settingsController.updateProfile);
router.post('/settings/subject', isLoggedIn, isTeacher, settingsController.updateSubject);

module.exports = router;
