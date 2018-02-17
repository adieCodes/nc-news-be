const router = require('express').Router();
const topicsRouter = require('./topics.router');
const articlesRouter = require('./articles.router');

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);

module.exports = router;
