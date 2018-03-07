/* eslint-disable consistent-return, no-underscore-dangle, no-console */

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const { Article, Comment, Topic, User } = require('../models');
const userData = require('./data/user_data');
const articleData = require('./data/articles');
const Chance = require('chance');
const _ = require('underscore');
const async = require('async');
const mongoose = require('mongoose');
const log4js = require('log4js');
const moment = require('moment');
const config = require('../config');

const DB_URI = config.DB[process.env.NODE_ENV] || process.env.DB_URI;

const logger = log4js.getLogger();
const chance = new Chance();

function addNorthcoderUser(done) {
  const userDoc = new User({
    username: 'northcoder',
    name: 'Awesome Northcoder',
    avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200'
  });
  userDoc.save(err => {
    if (err) return done(err);
    return done();
  });
}

function addUsers(done) {
  logger.info('adding users');
  async.eachSeries(
    userData,
    (user, cb) => {
      const userDoc = new User(user);
      userDoc.save(err => {
        if (err) return cb(err);
        return cb();
      });
    },
    err => {
      if (err) return done(err);
      return done(null);
    }
  );
}

function addTopics(done) {
  logger.info('adding topics');
  const topicDocs = [];
  async.eachSeries(
    ['Football', 'Cooking', 'Coding'],
    (topic, cb) => {
      const topicObj = {
        title: topic,
        slug: topic.toLowerCase()
      };
      const topicDoc = new Topic(topicObj);
      topicDoc.save((err, doc) => {
        if (err) {
          logger.error(JSON.stringify(err));
          return cb(err);
        }
        logger.info(JSON.stringify(doc));
        topicDocs.push(topicObj);
        return cb();
      });
    },
    err => {
      if (err) return done(err);
      return done(null, topicDocs);
    }
  );
}

function addArticles(topicDocs, done) {
  logger.info('adding articles');
  const docIds = [];
  async.eachSeries(
    topicDocs,
    (topic, cb) => {
      const articles = articleData[topic.slug];
      async.eachSeries(
        userData,
        (user, cbTwo) => {
          const usersArticle = articles[0];
          usersArticle.created_by = user.username;
          usersArticle.belongs_to = topic.slug;
          usersArticle.votes = _.sample(_.range(2, 11));
          const usersArticleDoc = new Article(usersArticle);
          usersArticleDoc.save((err, doc) => {
            if (err) {
              logger.error(JSON.stringify(err));
              return cb(err);
            }
            articles.shift();
            docIds.push(doc._id);
            const usersArticleTwo = articles[0];
            usersArticleTwo.created_by = user.username;
            usersArticleTwo.belongs_to = topic.slug;
            usersArticleTwo.votes = _.sample(_.range(2, 11));
            const usersArticleTwoDoc = new Article(usersArticleTwo);
            usersArticleTwoDoc.save((error, doc2) => {
              if (error) {
                logger.error(JSON.stringify(error));
                return cb(error);
              }
              articles.shift();
              docIds.push(doc2._id);
              return cbTwo();
            });
          });
        },
        err => {
          if (err) return cb(err);
          return cb(null, docIds);
        }
      );
    },
    err => {
      if (err) return done(err);
      return done(null, docIds);
    }
  );
}

function getRandomStamp() {
  return new Date(
    moment()
      .subtract(_.sample(_.range(1, 7)), 'days')
      .subtract(_.sample(_.range(1, 24)), 'hours')
      .subtract(_.sample(_.range(1, 60)), 'minutes')
      .format()
  ).getTime();
}

function addComments(docIds, done) {
  logger.info('adding comments');
  async.eachSeries(
    docIds,
    (id, cb) => {
      async.eachSeries(
        _.range(_.sample(_.range(5, 11))),
        (x, cbTwo) => {
          const comment = {
            body: chance.paragraph({ sentences: _.sample(_.range(2, 5)) }),
            belongs_to: id,
            created_by: userData[_.sample(_.range(6))].username,
            votes: _.sample(_.range(2, 11)),
            created_at: getRandomStamp()
          };
          const commentDoc = new Comment(comment);
          commentDoc.save(err => {
            if (err) return cb(err);
            return cbTwo();
          });
        },
        err => {
          if (err) return done(err);
          return cb();
        }
      );
    },
    err => {
      if (err) return done(err);
      return done();
    }
  );
}

mongoose.connect(DB_URI, err => {
  if (!err) {
    logger.info(`connect to ${process.env.NODE_ENV} database`);
    console.log(`connected to ${process.env.NODE_ENV} database`);
    mongoose.connection.db.dropDatabase();
    async.waterfall([addUsers, addTopics, addArticles, addComments, addNorthcoderUser], error => {
      if (error) {
        logger.error('ERROR SEEDING');
        console.log(JSON.stringify(error));
        process.exit();
      }
      console.log('DONE SEEDING!!');
      logger.info('DONE SEEDING!!');
      process.exit();
    });
  } else {
    logger.error('DB ERROR');
    console.log('err', err);
    process.exit();
  }
});
