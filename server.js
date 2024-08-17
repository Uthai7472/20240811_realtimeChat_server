const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const manageTbRoutes = require('./routes/manageTbRoute');
const chatRoutes = require('./routes/chatRoutes');
const protectedRoutes = require('./routes/protectedRoute');
const friendRoutes = require('./routes/friendRoutes')

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(cors({
    origin: '*'
}));

// SocketIO middleware
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('sendMessage', (data) => {
//         io.to(data.receiverId).emit('receiveMessage', data);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// })

app.use('/api/auth', authRoutes);
app.use('/api/manage_table', manageTbRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/protected/chat', chatRoutes);
app.use('/api/protected/friend', friendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));