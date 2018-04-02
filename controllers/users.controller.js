const { Article, Comment, User } = require('../models');

const getAllUsers = (req, res, next) => {
  User.find()
    .then(users => res.status(200).send({ users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { username } = req.params;
  const userDataQuery = User.findOne({ username });
  const userArticleQuery = Article.find({ created_by: username });
  const userCommentQuery = Comment.find({ created_by: username });

  return Promise.all([userDataQuery, userArticleQuery, userCommentQuery])
    .then(queryResults => {
      const userData = queryResults[0];
      const userArticles = queryResults[1];
      const userComments = queryResults[2];

      if (!userData) return next({ status: 400, msg: `No-one is using the username ${username}` });

      return res.status(200).send({ userData, userArticles, userComments });
    })
    .catch(next);
};

module.exports = { getAllUsers, getUser };
