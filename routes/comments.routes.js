const router = require('express').Router();
const { changeVoteCount, deleteComment } = require('../controllers/comments.controller');

router.put('/:commentId', changeVoteCount);
router.delete('/:commentId', deleteComment);

module.exports = router;
