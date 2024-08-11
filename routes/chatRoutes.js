const express = require('express');
const {authMiddleware} = require('../middleware/authMiddleware')
const { insertMessage, showMessage } = require('../controllers/chatController');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/message', authMiddleware, showMessage);
router.post('/message', authMiddleware, upload.single('imageUrl'), insertMessage);

module.exports = router;