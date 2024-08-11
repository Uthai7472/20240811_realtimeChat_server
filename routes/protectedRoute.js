const express = require('express');
const { protectedTest } = require('../controllers/protectedController');
const {authMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/test', authMiddleware,  protectedTest);


module.exports = router;