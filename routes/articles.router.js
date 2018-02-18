const router = require('express').Router();
const {
  getAllArticles,
  getArticleById,
  changeVoteCount
} = require('../controllers/articles.controller');
const {
  getCommentsByArticleId,
  addCommentToArticle
} = require('../controllers/comments.controller');

router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);
router.get('/:articleId/comments', getCommentsByArticleId);
router.post('/:articleId/comments', addCommentToArticle);
router.put('/:articleId', changeVoteCount);

module.exports = router;
