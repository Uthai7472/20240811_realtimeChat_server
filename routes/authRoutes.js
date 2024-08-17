const express = require('express');
const { register, showUsers, login, getUserFromId, updateUser } = require('../controllers/authController');
const { authMiddleware, verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/register', register);
router.get('/users', showUsers);
router.post('/login', login);
router.post('/verify', verifyToken);
router.get('/users/:id', authMiddleware, getUserFromId);
router.put('/update_user', authMiddleware, upload.single('profile_pic'), updateUser);

module.exports = router;