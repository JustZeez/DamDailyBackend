// const express = require('express');
// const router = express.Router();
// const { getNews } = require('../controllers/newsController');
// const { protect } = require('../middleware/authMiddleware');

// // Route to get news by category (e.g., /api/news/technology)
// // Users must be logged in to see the feed
// router.get('/:category', protect, getNews);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { getNews, getCategoryStats } = require('../controllers/newsController'); // 1. Added getCategoryStats
const { protect } = require('../middleware/authMiddleware');

// 2. IMPORTANT: Put static routes like /stats ABOVE the dynamic /:category route
// Route to get article counts for the Categories page
router.get('/stats', protect, getCategoryStats);

// 3. Dynamic category route (e.g., /api/news/technology)
router.get('/:category', protect, getNews);

module.exports = router;