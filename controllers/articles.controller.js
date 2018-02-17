const { Article } = require('../models');

const getTopicArticles = (req, res, next) => {
  const { topic } = req.params;
  Article.find({ belongs_to: topic })
    .then(articles => {
      if (articles.length === 0) return next({ status: 404, msg: 'No content' });
      return res.status(200).send({ articles });
    })
    .catch(next);
};

module.exports = { getTopicArticles };
