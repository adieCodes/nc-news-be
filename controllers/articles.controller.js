const { Article } = require('../models');

const getAllArticles = (req, res, next) => {
  Article.find()
    .sort({ votes: 'desc' })
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};

const getTopicArticles = (req, res, next) => {
  const { topic } = req.params;
  Article.find({ belongs_to: topic })
    .sort({ votes: 'desc', created_at: 'desc' })
    .then(articles => {
      if (articles.length === 0)
        return next({ status: 404, msg: `No content for the ${topic} topic` });
      return res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .then(article => res.status(200).send({ article }))
    .catch(err => {
      if (err.name === 'CastError')
        return next({ status: 400, msg: `There is no article with the id ${articleId}` });
      return next({ err });
    });
};

const changeVoteCount = (req, res, next) => {
  const { articleId } = req.params;
  const changeVoteCountBy = req.query.vote === 'up' ? 1 : -1;

  Article.findByIdAndUpdate(articleId, { $inc: { votes: changeVoteCountBy } }, { new: true })
    .then(article => res.status(200).send({ article }))
    .catch(err => {
      if (err.name === 'CastError')
        return next({ status: 400, msg: `There is no article with the id ${articleId}` });
      return next(err);
    });
};

module.exports = { getAllArticles, getTopicArticles, getArticleById, changeVoteCount };
