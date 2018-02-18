const router = require('express').Router();
const { changeVoteCount } = require('../controllers/comments.controller');

router.put('/:commentId', changeVoteCount);

module.exports = router;
