const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setupController');

router.get('/setup-teacher', setupController.showSetupForm);
router.post('/setup-teacher', setupController.createTeacherAccount);

module.exports = router;
