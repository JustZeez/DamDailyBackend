// const express = require('express');
// const dotenv = require('dotenv').config();
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const adminAuthRoutes = require('./routes/adminAuthRoutes')
// const adminRoutes = require('./routes/adminRoutes');
// const userRoutes = require('./routes/userRoutes');
// const newsRoutes = require('./routes/newsRoutes');
// const contactRoutes = require('./routes/contactRoutes')
// const app = express();


// connectDB();





// const limiter = rateLimit({
//     windowMs: 15 * 60 *1000,
//     max:100
// });

// app.use(helmet());
// app.use(limiter);
// app.use(cors({
//     origin: process.env.FRONTEND_URL ||
//     //  'http://localhost:5173',
//     'https://damdaily.vercel.app',
//     credentials:true
// }));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// // Routes
// app.use('/api/auth', authRoutes);
// app.use("/api/admin/auth", adminAuthRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/news', newsRoutes);
// app.use('/api/contact', contactRoutes)


// app.get('/', (req, res) => {
//     res.send({message: 'DamDaily Backend is running successfully'});
//     console.log('Homepage accessed');
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes')
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contactRoutes = require('./routes/contactRoutes')
const app = express();

connectDB();

// --- REPLACED OLD CORS LOGIC ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://damdaily.vercel.app',
    process.env.FRONTEND_URL // This picks up whatever you set in Render Dashboard
].filter(Boolean); // Removes undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ------------------------------

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(helmet());
app.use(limiter);
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
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));