const { executeQuery } = require('../config/database');

const searchFriend = async (req, res) => {
    const { line_id } = req.body;

    console.log('Friend Line ID:', line_id);

    try {
        const searchQuery = `
            SELECT username, id FROM users
            WHERE line_id = ?
        `;

        const result = await executeQuery(searchQuery, [line_id]);
        const friend_user = result[0];
        console.log("Username:", friend_user.username);

        return res.status(200).json({ username: friend_user.username, id: friend_user.id });

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
        const user = req.user;
        const user_id = user.id;

        // Show friends of this user_id
        const friendsQuery = `
            SELECT * FROM friends 
            WHERE user_id = ?
        `
        const resultFriends = await executeQuery(friendsQuery, [user_id]);
        const friendsData = [];

        for(const friend of resultFriends) {
            const friend_id = friend.friend_id;

            // Use friend_id to find username him/her
            const resultFriendData = await executeQuery(`
                SELECT id, username, email FROM users 
                WHERE id = ?
            `, [friend_id]);

            if (resultFriendData.length > 0) {
                friendsData.push(resultFriendData[0]);
            }
        }

        

        console.log('resultFriends data:', friendsData);
        return res.status(200).json({ friendsData: friendsData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    searchFriend,
    addFriend,
    showFriends
}