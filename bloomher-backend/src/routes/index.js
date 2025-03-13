const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserData, trackMenstrualCycle, managePCOS } = require('../controllers/index');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', getUserData);

// Menstrual tracking routes
router.post('/menstrual/track', trackMenstrualCycle);

// PCOS management routes
router.post('/pcos/manage', managePCOS);

module.exports = router;