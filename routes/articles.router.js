const router = require('express').Router();
const { getAllArticles, getArticleById } = require('../controllers/articles.controller');
const { getCommentsByArticleId } = require('../controllers/comments.controller');

router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);
router.get('/:articleId/comments', getCommentsByArticleId);

module.exports = router;
