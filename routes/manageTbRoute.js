const express = require('express');
const {
    createTbUsers,
    createTbMessage,
    createTbFriend,
    deleteTbUsers,
    deleteTbMessage,
    deleteTbFriend,
    dropTbUsers,
    dropTbMessage,
    dropTbFriend
} = require('../controllers/manageTbController');
const router = express.Router();

router.get('/create_users', createTbUsers);
router.get('/drop_users', dropTbUsers);
router.delete('/users', deleteTbUsers);
router.get('/create_message', createTbMessage);
router.get('/drop_message', dropTbMessage);
router.delete('/message', deleteTbMessage);
router.get('/create_friends', createTbFriend);
router.get('/drop_friends', dropTbFriend);
router.delete('/friends', deleteTbFriend);

module.exports = router;