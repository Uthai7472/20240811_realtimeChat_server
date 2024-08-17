const {executeQuery} = require('../config/database');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const insertMessage = async (req, res) => {
    const {message, imageUrl, receiver_id, datetime} = req.body;
    const user = req.user;
    const sender_id = user.id;

    console.log("User: ", user);

    if (!sender_id) {
        return res.status(400).json({ message: 'Sender ID is required' });
    }

    if (!message && !req.file) {
        console.log('Message or ImageUrl are required', req.file)
        return res.status(403).json({ message: 'Message or ImageUrl are required'});
    }

    try {
        let uploadedImageUrl = null;
        console.log('File:', req.file);

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'chat_images' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                    console.log('Result secure_url:', result.secure_url);
                }).end(req.file.buffer);
            });

            uploadedImageUrl = uploadResult;
            console.log(uploadedImageUrl);
        }

        const insertMessageAndImgQuery = `
                INSERT INTO messages (sender_id, receiver_id, message, imageUrl, created_at)
                VALUES (?, ?, ?, ?, ?)
            `;
        const result = await executeQuery(insertMessageAndImgQuery, [sender_id, receiver_id, message || null, uploadedImageUrl || null, datetime]);
        
        return res.status(201).json({ message: 'Insert message and imageUrl successfully'})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const showMessage = async (req, res) => {
    const { receiver_id } = req.query;
    const user = await req.user;
    const sender_id = user.id;

    console.log("User: ", user);

    try {
        const query = `
            SELECT * FROM messages
            WHERE (sender_id = ? AND receiver_id = ?)
                OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `

        const messages = await executeQuery(query, [sender_id, receiver_id, receiver_id, sender_id]);

        if (messages.length === 0) {
            return res.status(200).json({ message: 'No messages found between these users', messages: [] });
        }

        return res.status(201).json({ messages });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    insertMessage,
    showMessage
}