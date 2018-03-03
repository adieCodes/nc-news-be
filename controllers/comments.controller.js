const { Comment } = require('../models');

const getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;

  Comment.find({ belongs_to: articleId })
    .sort({ votes: 'desc', created_at: 'desc' })
    .then(comments => {
      if (!comments.length) next({ status: 404, msg: `Article id ${articleId} has no comments` });
      res.status(200).send({ comments });
    })
    .catch(err => {
      if (err.name === 'CastError')
        return next({
          status: 400,
          msg: `There are no comments for the article with id ${articleId} yet`
        });
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
      if (err.name === 'ValidationError')
        return next({ status: 400, msg: `There is no article with the id ${articleId}` });
      return next({ err });
    });
};

const changeVoteCount = (req, res, next) => {
  const { commentId } = req.params;
  const changeVoteCountBy = req.query.vote === 'up' ? 1 : -1;

  Comment.findByIdAndUpdate(commentId, { $inc: { votes: changeVoteCountBy } }, { new: true })
    .then(comment => res.status(200).send({ comment }))
    .catch(err => {
      if (err.name === 'CastError')
        return next({ status: 400, msg: `There is no comment with the id ${commentId}` });
      return next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { commentId } = req.params;

  Comment.findByIdAndRemove(commentId)
    .then(comment => res.status(200).send({ comment }))
    .catch(err => {
      if (err.name === 'CastError')
        return next({ status: 400, msg: `There is no comment with the id ${commentId}` });
      return next(err);
    });
};

module.exports = { getCommentsByArticleId, addCommentToArticle, changeVoteCount, deleteComment };
