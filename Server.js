const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes')
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/UserRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contactRoutes = require('./routes/contactRoutes')
const app = express();


connectDB();


app.use(cors());


const limiter = rateLimit({
    windowMs: 15 * 60 *1000,
    max:100
});

app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: process.env.FRONTEND_URL ||
     'http://localhost:5173',
    // 'https://miwacakesandtreatsfrontend.vercel.app',
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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