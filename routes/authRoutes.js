const express = require('express');
const { register, showUsers, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.get('/users', showUsers);
router.post('/login', login);
router.post('/verify', verifyToken);

module.exports = router;