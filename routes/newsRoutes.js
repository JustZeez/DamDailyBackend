const express = require('express');
const router = express.Router();
const { getNews, getCategoryStats } = require('../controllers/newsController'); 
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getCategoryStats);
router.get('/:category', protect, getNews);

module.exports = router;