const router = require('express').Router();
const { getAllTopics } = require('../controllers/topics.controller');
const { getTopicArticles } = require('../controllers/articles.controller');

router.get('/', getAllTopics);
router.get('/:topic/articles', getTopicArticles);

module.exports = router;
