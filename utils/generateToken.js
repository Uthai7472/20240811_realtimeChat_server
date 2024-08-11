const jwt = require('jsonwebtoken');

const generateToken = (id, username, email, permission) => {
    return jwt.sign({ id, username, email, permission }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;