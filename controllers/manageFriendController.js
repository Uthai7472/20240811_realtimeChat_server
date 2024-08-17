const { executeQuery } = require('../config/database');

const searchFriend = async (req, res) => {
    const { line_id } = req.body;
    const user_id = req.user.id;

    console.log('Friend Line ID:', line_id);

    try {
        const searchQuery = `
            SELECT username, id, profile_pic FROM users
            WHERE line_id = ? AND id != ?
        `;

        const result = await executeQuery(searchQuery, [line_id, user_id]);
        const friend_user = result[0];
        if (!friend_user) {
            return res.status(404).json({ message: 'User not found or cannot add yourself as a friend' });
        }

        const checkFriendQuery = `
            SELECT * FROM friends
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
        `

        const isFriend = await executeQuery(checkFriendQuery, [user_id, friend_user.id, friend_user.id, user_id]);

        let isAlreadyFriend = isFriend.length > 0;

        console.log("Username:", friend_user.username);

        return res.status(200).json({ username: friend_user.username, id: friend_user.id, profile_pic: friend_user.profile_pic,
            isAlreadyFriend
         });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const addFriend = async (req, res) => {
    // Get ID (INT) from user and friend
    const { user_id, friend_id } = req.body;

    console.log('User ID:', user_id);
    console.log('Friend ID:', friend_id);

    try {
        const addQuery = `
            INSERT INTO friends (user_id, friend_id, status)
            VALUES (?, ?, 'accepted')
        `;

        const result = await executeQuery(addQuery, [user_id, friend_id]);

        return res.status(200).json({ message: 'Add friend success'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const showFriends = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Show friends of this user_id
        const friendsQuery = `
            SELECT u.id, u.username, u.profile_pic 
            FROM friends f
            JOIN users u ON (f.friend_id = u.id OR f.user_id = u.id)
            WHERE (f.user_id = ? OR f.friend_id = ?) 
              AND u.id != ?
              AND f.status = 'accepted'
        `;
        const resultFriends = await executeQuery(friendsQuery, [user_id, user_id, user_id]);

        if (resultFriends.length === 0) {
            return res.status(400).json({ message: 'No friends' });
        }

        console.log('resultFriends data:', resultFriends.length);
        return res.status(200).json({ friendsData: resultFriends });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const showAllFriend = async (req, res) => {
    try {
        const query = 'SELECT * FROM friends';

        const result = await executeQuery(query, []);
        return res.status(200).json({ result: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    searchFriend,
    addFriend,
    showFriends,
    showAllFriend
}