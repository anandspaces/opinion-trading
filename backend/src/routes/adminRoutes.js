const express = require('express');
const router = express.Router();
const { getAllUsers, settleEvent } = require('../controllers/adminController');
const { auth, adminAuth } = require('../utils/authMiddleware');

router.get('/users', auth, adminAuth, getAllUsers);
router.post('/settle-event/:id', auth, adminAuth, settleEvent);

module.exports = router;