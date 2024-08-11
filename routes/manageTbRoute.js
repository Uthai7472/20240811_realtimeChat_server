const express = require('express');
const {
    createTbUsers,
    createTbMessage,
    deleteTbUsers,
    deleteTbMessage,
    dropTbUsers,
    dropTbMessage
} = require('../controllers/manageTbController');
const router = express.Router();

router.get('/create_users', createTbUsers);
router.get('/drop_users', dropTbUsers);
router.delete('/users', deleteTbUsers);
router.get('/create_message', createTbMessage);
router.get('/drop_message', dropTbMessage);
router.delete('/message', deleteTbMessage);

module.exports = router;