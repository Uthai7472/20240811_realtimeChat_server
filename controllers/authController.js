const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

const showUsers = async (req, res) => {
    try {
        const showQuery = `SELECT * FROM users`;

        const result = await executeQuery(showQuery, []);

        return res.status(201).json({ message: 'Show users table success', result});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error'});
    }
}

const register = async (req, res) => {
    const {username, email, password, permission} = req.body;
    
    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const existingUsers = await executeQuery(query, [email]);
        console.log(existingUsers.length);

        if(existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const insertUserQuery = `INSERT INTO users (username, email, password, permission) VALUES(?, ?, ?, ?)`;
        await executeQuery(insertUserQuery, [username, email, hashedPassword, permission]);

        return res.status(201).json({ message: 'User registered successfully'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

const login = async (req, res) => {
    const {username, password} = req.body;
    
    try {
        const query = `SELECT * FROM users WHERE username = ?`;
        const users = await executeQuery(query, [username]);

        if(users.length === 0) {
            return res.status(400).json({ message: 'Invalid username and password'});
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username and password'});
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                permission: user.permission
            }, process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return res.status(201).json({ message: 'User login successfully', token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                permission: user.permission,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

module.exports = {
    register,
    showUsers,
    login
}