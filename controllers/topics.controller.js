const { Topic } = require('../models');

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

module.exports = { getAllTopics };
