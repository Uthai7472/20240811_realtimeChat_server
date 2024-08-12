const express = require('express');
const {searchFriend, addFriend} = require('../controllers/manageFriendController');
const {authMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/search_friend', authMiddleware, searchFriend);
router.post('/add_friend', authMiddleware, addFriend);

module.exports = router;