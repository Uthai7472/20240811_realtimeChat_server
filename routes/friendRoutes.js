const express = require('express');
const {searchFriend, addFriend, showFriends, showAllFriend} = require('../controllers/manageFriendController');
const {authMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/search_friend', authMiddleware, searchFriend);
router.post('/add_friend', authMiddleware, addFriend);
router.get('/show_friends', authMiddleware, showFriends);
router.get('/show_friend_table', authMiddleware, showAllFriend);

module.exports = router;