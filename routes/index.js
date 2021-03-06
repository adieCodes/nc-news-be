const router = require('express').Router();
const topicsRouter = require('./topics.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.routes');
const usersRouter = require('./users.routes');

router.get('/', (req, res) => res.status(200).send({ status: 200, msg: 'OK' }));
router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);

module.exports = router;
