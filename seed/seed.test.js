/* eslint-disable no-underscore-dangle */

const { User, Comment, Topic, Article } = require('../models');

const savedData = {};

const saveUser = () => {
  const user = new User({
    username: 'northcoder',
    name: 'Awesome Northcoder',
    avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200'
  });
  return user.save();
};

const saveTopics = () => {
  const topics = [
    { title: 'Football', slug: 'football' },
    { title: 'Cooking', slug: 'cooking' },
    { title: 'Cats', slug: 'cats' }
  ].map(topic => new Topic(topic).save());

  return Promise.all(topics);
};

const saveArticles = () => {
  const articles = [
    { title: 'Cats are great', body: 'something', belongs_to: 'cats' },
    { title: 'Football is fun', body: 'something', belongs_to: 'football' },
    { title: 'Football is life', body: 'something', belongs_to: 'football', votes: 100 },
    { title: 'Football is awful', body: 'something', belongs_to: 'football', votes: -21 }
  ].map(article => new Article(article).save());

  return Promise.all(articles);
};

const saveComments = articles => {
  const comments = [
    { body: 'this is a comment', belongs_to: articles[0]._id, created_by: 'northcoder' },
    { body: 'this is another comment', belongs_to: articles[0]._id, created_by: 'northcoder' }
  ].map(comment => new Comment(comment).save());

  return Promise.all(comments);
};

const saveTestData = () =>
  saveUser()
    .then(user => {
      savedData.user = user;
      return saveTopics();
    })
    .then(topics => {
      savedData.topics = topics;
      return saveArticles();
    })
    .then(articles => {
      savedData.articles = articles;
      return saveComments(articles);
    })
    .then(comments => {
      savedData.comments = comments;
      return savedData;
    });

module.exports = saveTestData;
