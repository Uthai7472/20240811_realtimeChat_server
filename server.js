const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const manageTbRoutes = require('./routes/manageTbRoute');
const chatRoutes = require('./routes/chatRoutes');
const protectedRoutes = require('./routes/protectedRoute');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/api/auth', authRoutes);
app.use('/api/manage_table', manageTbRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/protected/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));