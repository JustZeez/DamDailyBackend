const NewsCache = require('../models/newsCache');
const { fetchNewsFromAPI } = require('../services/newsService');

const getNews = async (req, res) => {
  try {
    let category = req.params.category || 'top';
    const CACHE_DURATION = 60 * 60 * 1000; 

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


const getCategoryStats = async (req, res) => {
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

    
    const formattedStats = stats.map(s => ({
      _id: s.category,
      count: s.count
    }));

    res.status(200).json({ success: true, data: formattedStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getNews,
  getCategoryStats
}