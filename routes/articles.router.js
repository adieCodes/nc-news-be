const router = require('express').Router();
const { getAllArticles, getArticleById } = require('../controllers/articles.controller');
const {
  getCommentsByArticleId,
  addCommentToArticle
} = require('../controllers/comments.controller');

router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);
router.get('/:articleId/comments', getCommentsByArticleId);
router.post('/:articleId/comments', addCommentToArticle);

module.exports = router;
