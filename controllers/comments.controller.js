const { Comment } = require('../models');

const getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;

  Comment.find({ belongs_to: articleId })
    .then(comments => res.status(200).send({ comments }))
    .catch(err => {
      if (err.name === 'CastError')
        return next({ status: 400, msg: 'There are no comments for this article yet' });
      return next(err);
    });
};

const addCommentToArticle = (req, res, next) => {
  const { articleId } = req.params;
  const newComment = new Comment({ body: req.body.comment, belongs_to: articleId });

  return newComment
    .save()
    .then(() => Comment.find({ belongs_to: articleId }))
    .then(comments => res.status(201).send({ comments }))
    .catch(err => {
      if (err.name === 'ValidationError') return next({ status: 400, msg: 'Invalid article Id' });
      return next({ err });
    });
};

module.exports = { getCommentsByArticleId, addCommentToArticle };
