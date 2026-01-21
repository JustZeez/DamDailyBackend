const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const adminAuthRoutes = require('../routes/adminAuthRoutes')
const adminRoutes = require('../routes/adminRoutes');
const userRoutes = require('../routes/UserRoutes');
const newsRoutes = require('../routes/newsRoutes');
const contactRoutes = require('../routes/contactRoutes')
const app = express();


connectDB();


app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes)


app.get('/', (req, res) => {
    res.send({message: 'DamDaily Backend is running successfully'});
    console.log('Homepage accessed');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));