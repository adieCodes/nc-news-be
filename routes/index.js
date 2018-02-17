const router = require('express').Router();
const { getAllTopics } = require('../controllers/topics.controller');

router.use('/topics', getAllTopics);

module.exports = router;
