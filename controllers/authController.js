const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
    const {username, email, line_id, password, permission} = req.body;
    const defaultProfilePic = 'https://res.cloudinary.com/dfwqa92vq/image/upload/v1723733097/user_profiles/zgjfsaguz750n2qukomf.png'
    
    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const existingUsers = await executeQuery(query, [email]);
        console.log(existingUsers.length);

        if(existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const insertUserQuery = `INSERT INTO users (username, email, line_id, password, permission, profile_pic) VALUES(?, ?, ?, ?, ?, ?)`;
        await executeQuery(insertUserQuery, [username, email, line_id, hashedPassword, permission, defaultProfilePic]);

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
                line_id: user.line_id,
                permission: user.permission,
                profile_pic: user.profile_pic
            }, process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        return res.status(201).json({ message: 'User login successfully', token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                permission: user.permission,
                profile_pic: user.profile_pic
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

const getUserFromId = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `SELECT id, username, email, line_id, profile_pic FROM users WHERE id = ? `;
        const result = await executeQuery(query, [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User found', result: result[0] });

    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateUser = async (req, res) => {
    const {id, username, email, password, permission} = req.body;
    const profilePic = req.file;
    let  hashedPassword;

    console.log('Update User:', [id]);

    try {
        const query = `SELECT * FROM users WHERE id = ?`;
        const users = await executeQuery(query, [id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare fields for update
        const updateFields = [];
        const updateValues = [];

        if (username) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (password) {
            // Hash the password before updating it
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }
        if (permission != undefined) {
            updateFields.push('permission = ?');
            updateValues.push(permission);
        }
        
        if (profilePic) {
            const uploadImageUrl = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'user_profiles' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }).end(profilePic.buffer);
            });

            updateFields.push('profile_pic = ?');
            updateValues.push(uploadImageUrl);
        }

        updateValues.push(id);

        if (updateFields.length > 0) {
            const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
            await executeQuery(updateQuery, updateValues);
        }

        return res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    register,
    showUsers,
    login,
    getUserFromId,
    updateUser
}
