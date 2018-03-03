const { User } = require('../models');

const getUser = (req, res, next) => {
  const { username } = req.params;

  User.findOne({ username })
    .then(user => {
      if (!user) return next({ status: 400, msg: `No-one is using the username ${username}` });
      return res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { getUser };
