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

module.exports = { getCommentsByArticleId };
