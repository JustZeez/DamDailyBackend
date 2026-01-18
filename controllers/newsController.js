
// const NewsCache = require('../models/newsCache');
// const { fetchNewsFromAPI } = require('../services/newsService');

// const getNews = async (req, res) => {
//   try {
//     // 1. Get category from URL params. Default to 'top' if nothing is provided.
//     let category = req.params.category || 'top';
//     const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

//     // 2. Logic to handle "all" vs specific categories
//     // We search the database for this specific category cache
//     let cachedData = await NewsCache.findOne({ category });
//     const isCacheFresh = cachedData && (Date.now() - cachedData.lastUpdated < CACHE_DURATION);

//     let rawArticles;
//     let source;

//     if (isCacheFresh) {
//       rawArticles = cachedData.articles;
//       source = 'database';
//     } else {
//       // Pass the category to the service. 
//       // If category is 'all' or 'top', the service will fetch the general feed.
//       rawArticles = await fetchNewsFromAPI(category);
//       source = 'api';

//       // Update or Create Cache
//       if (cachedData) {
//         cachedData.articles = rawArticles;
//         cachedData.lastUpdated = Date.now();
//         await cachedData.save();
//       } else {
//         await NewsCache.create({
//           category,
//           articles: rawArticles,
//           lastUpdated: Date.now()
//         });
//       }
//     }

//     // ✨ 3. DATA CLEANING (Free Tier Formatting)
//     const cleanArticles = rawArticles.map((article) => {
//       const cleaned = { ...article };
//       const restrictedFields = [
//         'content', 'sentiment', 'sentiment_stats', 
//         'ai_tag', 'ai_region', 'ai_org', 'ai_summary'
//       ];
//       restrictedFields.forEach((field) => delete cleaned[field]);
//       return cleaned;
//     });

//     // 🔍 LOGGING
//     console.log('--- NEWS FETCHED SUCCESSFULLY ---');
//     console.log(`Requested Category: ${category}`);
//     console.log(`Source: ${source}`);
//     console.log(`Total Articles: ${cleanArticles.length}`);

//     return res.status(200).json({
//       success: true,
//       source: source,
//       count: cleanArticles.length,
//       data: cleanArticles 
//     });

//   } catch (error) {
//     console.error('News Controller Error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to retrieve news',
//       error: error.message
//     });
//   }
// };
// exports.getCategoryStats = async (req, res) => {
//   try {
//     const stats = await News.aggregate([
//       { $unwind: "$category" },
//       { $group: { _id: "$category", count: { $sum: 1 } } }
//     ]);
//     res.status(200).json({ success: true, data: stats });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { getNews };
const NewsCache = require('../models/newsCache');
const { fetchNewsFromAPI } = require('../services/newsService');

// 1. Export getNews at the top
exports.getNews = async (req, res) => {
  try {
    let category = req.params.category || 'top';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

    let cachedData = await NewsCache.findOne({ category });
    const isCacheFresh = cachedData && (Date.now() - cachedData.lastUpdated < CACHE_DURATION);

    let rawArticles;
    let source;

    if (isCacheFresh) {
      rawArticles = cachedData.articles;
      source = 'database';
    } else {
      rawArticles = await fetchNewsFromAPI(category);
      source = 'api';

      if (cachedData) {
        cachedData.articles = rawArticles;
        cachedData.lastUpdated = Date.now();
        await cachedData.save();
      } else {
        await NewsCache.create({
          category,
          articles: rawArticles,
          lastUpdated: Date.now()
        });
      }
    }

    const cleanArticles = rawArticles.map((article) => {
      const cleaned = { ...article };
      const restrictedFields = [
        'content', 'sentiment', 'sentiment_stats', 
        'ai_tag', 'ai_region', 'ai_org', 'ai_summary'
      ];
      restrictedFields.forEach((field) => delete cleaned[field]);
      return cleaned;
    });

    return res.status(200).json({
      success: true,
      source: source,
      count: cleanArticles.length,
      data: cleanArticles 
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve news',
      error: error.message
    });
  }
};

// 2. Export getCategoryStats at the top
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await NewsCache.aggregate([
      {
        $project: {
          _id: 0,
          category: 1,
          count: { $size: "$articles" }
        }
      }
    ]);

    // This converts the internal names to what your Categories.jsx expects
    const formattedStats = stats.map(s => ({
      _id: s.category,
      count: s.count
    }));

    res.status(200).json({ success: true, data: formattedStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};