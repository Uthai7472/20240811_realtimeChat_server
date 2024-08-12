const { executeQuery } = require('../config/database');

const createTbUsers = async (req, res) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE,
                line_id VARCHAR(50) UNIQUE,
                email VARCHAR(50),
                password VARCHAR(100),
                permission INT
            )
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Create Table users successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const deleteTbUsers = async (req, res) => {
    try {
        const query = `
            DELETE FROM users;
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Delete every datas on users successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const dropTbUsers = async (req, res) => {
    try {
        const query = `
            DROP TABLE users
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Drop table users successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

// -------------------------------------------------
const createTbMessage = async (req, res) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT,
                receiver_id INT,
                message TEXT,
                imageUrl VARCHAR(200),
                created_at DATETIME
            )CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Create Table messages successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const deleteTbMessage = async (req, res) => {
    try {
        const query = `
            DELETE FROM messages;
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Delete every datas on messages successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const dropTbMessage = async (req, res) => {
    try {
        const query = `
            DROP TABLE messages
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Drop table messages successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

// -------------------------------------------------
const createTbFriend = async (req, res) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS friends (
                user_id INT NOT NULL,
                friend_id INT NOT NULL,
                status ENUM('pending', 'accepted', 'blocked') NOT NULL DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Create Table friends successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const deleteTbFriend = async (req, res) => {
    try {
        const query = `
            DELETE FROM friends;
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Delete every datas on friends successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const dropTbFriend = async (req, res) => {
    try {
        const query = `
            DROP TABLE friends
        `;

        const result = await executeQuery(query, []);

        return res.status(201).json({ message: 'Drop table friends successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}


module.exports = {
    createTbUsers,
    createTbMessage,
    createTbFriend,
    deleteTbUsers,
    deleteTbMessage,
    deleteTbFriend,
    dropTbUsers,
    dropTbMessage,
    dropTbFriend

}