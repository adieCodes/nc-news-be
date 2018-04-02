/* eslint-disable no-underscore-dangle, arrow-body-style, camelcase, no-console */

process.env.NODE_ENV = 'test';

const app = require('../server');
const { expect } = require('chai');
const mongoose = require('mongoose');
const supertest = require('supertest');
const saveTestData = require('../seed/seed.test');

const request = supertest(app);

describe('API', () => {
  let usefulData = {};
  beforeEach(() => {
    return mongoose.connection
      .dropDatabase()
      .then(saveTestData)
      .then(data => {
        usefulData = data;
      })
      .catch(console.log);
  });

  after(() => {
    mongoose.disconnect();
  });

  describe('GET /api', () => {
    it('returns 200 and msg', () => {
      return request
        .get('/api')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal(200);
          expect(res.body.msg).to.equal('OK');
        });
    });
  });

  describe('GET /api/topics', () => {
    it('returns 200 and all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics.length).to.eql(usefulData.topics.length);
          expect(res.body.topics[0].title).to.be.a('string');
          expect(res.body.topics[0].slug).to.be.a('string');
          expect(res.body.topics[0]._id).to.be.a('string');
        });
    });
    it('sorts topics by title', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics[0].title).to.equal('Cats');
          expect(res.body.topics[1].title).to.equal('Cooking');
          expect(res.body.topics[2].title).to.equal('Football');
        });
    });
  });
  describe('GET /api/topics/:topic/articles', () => {
    it('returns 200 and all articles for matching topic', () => {
      return request
        .get(`/api/topics/football/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0].title).to.be.a('string');
          expect(res.body.articles[0].body).to.be.a('string');
          expect(res.body.articles[0].votes).to.be.a('number');
        });
    });
    it('returns 404 for invalid topic', () => {
      const topic = 'tennis';

      return request
        .get(`/api/topics/${topic}/articles`)
        .expect(404)
        .then(res => {
          expect(res.body.status).to.equal(404);
          expect(res.body.msg).to.equal(`No content for the ${topic} topic`);
        });
    });
    it('sorts articles by votes and then time created', () => {
      return request
        .get('/api/topics/football/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].title).to.equal('Football is life');
          expect(res.body.articles[1].title).to.equal('Football is fun');
          expect(res.body.articles[2].title).to.equal('Football is unavoidable');
          expect(res.body.articles[3].title).to.equal('Football is awful');
        });
    });
  });
  describe('GET /api/articles', () => {
    it('returns 200 and all articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(usefulData.articles.length);
          expect(res.body.articles[0].title).to.be.a('string');
          expect(res.body.articles[0].body).to.be.a('string');
          expect(res.body.articles[0].belongs_to).to.be.a('string');
          expect(res.body.articles[0].votes).to.be.a('number');
        });
    });
    it('sorts articles by votes and then time created', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].title).to.equal('Football is life');
          expect(res.body.articles[1].title).to.equal('Cats are great');
          expect(res.body.articles[2].title).to.equal('Football is fun');
          expect(res.body.articles[3].title).to.equal('Football is unavoidable');
          expect(res.body.articles[4].title).to.equal('Football is awful');
        });
    });
  });
  describe('GET /api/articles/:articleId', () => {
    it('returns 200 and relevant article', () => {
      const { _id, title, body, belongs_to, votes } = usefulData.articles[0];

      return request
        .get(`/api/articles/${_id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article.title).to.equal(title);
          expect(res.body.article.body).to.equal(body);
          expect(res.body.article.belongs_to).to.equal(belongs_to);
          expect(res.body.article.votes).to.equal(votes);
        });
    });
    it('returns 400 if invalid articleId', () => {
      const articleId = 1;

      return request
        .get(`/api/articles/${articleId}`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal(`There is no article with the id ${articleId}`);
        });
    });
  });
  describe('GET /api/articles/:articleId/comments', () => {
    it('returns 200 and all comments for relevant article', () => {
      const articleId = usefulData.articles[0]._id;

      return request
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments.length).to.equal(usefulData.comments.length);
          expect(res.body.comments[0].body).to.be.a('string');
          expect(res.body.comments[0].belongs_to).to.be.a('string');
          expect(res.body.comments[0].created_at).to.be.a('number');
          expect(res.body.comments[0].votes).to.be.a('number');
          expect(res.body.comments[0].created_by).to.be.a('string');
        });
    });
    it('returns 404 when article has no comments', () => {
      const articleId = usefulData.articles[1]._id;

      return request
        .get(`/api/articles/${articleId}/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.status).to.equal(404);
          expect(res.body.msg).to.equal(`Article id ${articleId} has no comments`);
        });
    });
    it('returns 400 if invalid articleId', () => {
      const articleId = 1;

      return request
        .get(`/api/articles/${articleId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            `There are no comments for the article with id ${articleId} yet`
          );
        });
    });
    it('returns comments sorted by vote count and then time created', () => {
      const articleId = usefulData.articles[0]._id;

      return request
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments[0].body).to.equal('this is a third comment');
          expect(res.body.comments[1].body).to.equal('this is a comment');
          expect(res.body.comments[2].body).to.equal('this is a forth comment');
          expect(res.body.comments[3].body).to.equal('this is another comment');
        });
    });
  });
  describe('POST /api/articles/:articleId/comments', () => {
    const commentContent = 'This is a test comment';
    it('returns 201, adds comment to the database and returns all comments for article', () => {
      const articleId = usefulData.articles[0]._id;
      const commentCountPrePost = usefulData.comments.length;

      return request
        .post(`/api/articles/${articleId}/comments`)
        .send({ comment: commentContent })
        .expect(201)
        .then(res => {
          expect(res.body.comments.length).to.equal(commentCountPrePost + 1);
          expect(res.body.comments[commentCountPrePost].body).to.equal(commentContent);
          expect(res.body.comments[0].belongs_to).to.equal(`${articleId}`);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      const articleId = 1;

      return request
        .post(`/api/articles/${articleId}/comments`)
        .send({ comment: commentContent })
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal(`There is no article with the id ${articleId}`);
        });
    });
  });
  describe('PUT /api/articles/:articleId', () => {
    it('returns 200, increments vote and returns article', () => {
      const { _id, title, body, belongs_to } = usefulData.articles[0];
      const voteCountPrePost = usefulData.articles[0].votes;

      return request
        .put(`/api/articles/${_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(voteCountPrePost + 1);
          expect(res.body.article.title).to.equal(title);
          expect(res.body.article.body).to.equal(body);
          expect(res.body.article.belongs_to).to.equal(belongs_to);
        });
    });
    it('returns 200, decrements vote and returns article', () => {
      const { _id, title, body, belongs_to } = usefulData.articles[0];
      const voteCountPrePost = usefulData.articles[0].votes;

      return request
        .put(`/api/articles/${_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(voteCountPrePost - 1);
          expect(res.body.article.title).to.equal(title);
          expect(res.body.article.body).to.equal(body);
          expect(res.body.article.belongs_to).to.equal(belongs_to);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      const articleId = 1;

      return request
        .put(`/api/articles/${articleId}?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal(`There is no article with the id ${articleId}`);
        });
    });
  });
  describe('PUT /api/comments/:commentId', () => {
    it('returns 200, increments vote and returns article', () => {
      const { _id, belongs_to, created_by, body } = usefulData.comments[0];
      const voteCountPrePost = usefulData.comments[0].votes;

      return request
        .put(`/api/comments/${_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(voteCountPrePost + 1);
          expect(res.body.comment.belongs_to).to.equal(`${belongs_to}`);
          expect(res.body.comment.created_by).to.equal(created_by);
          expect(res.body.comment.body).to.equal(body);
        });
    });
    it('returns 200, decrements vote and returns article', () => {
      const { _id, belongs_to, created_by, body } = usefulData.comments[0];
      const voteCountPrePost = usefulData.comments[0].votes;

      return request
        .put(`/api/comments/${_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(voteCountPrePost - 1);
          expect(res.body.comment.belongs_to).to.equal(`${belongs_to}`);
          expect(res.body.comment.created_by).to.equal(created_by);
          expect(res.body.comment.body).to.equal(body);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      const commentId = 1;

      return request
        .put(`/api/comments/${commentId}?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal(`There is no comment with the id ${commentId}`);
        });
    });
  });
  describe('DELETE /api/comments/:commentId', () => {
    it('returns 200, deletes comment and returns article', () => {
      const { _id, votes, belongs_to, created_by, body } = usefulData.comments[0];

      return request
        .delete(`/api/comments/${_id}`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(votes);
          expect(res.body.comment.belongs_to).to.equal(`${belongs_to}`);
          expect(res.body.comment.created_by).to.equal(created_by);
          expect(res.body.comment.body).to.equal(body);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      const commentId = 1;

      return request
        .delete(`/api/comments/${commentId}`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal(`There is no comment with the id ${commentId}`);
        });
    });
  });
  describe('GET /api/users/:username', () => {
    it('returns 200, userData and userArticles', () => {
      const { username, name, avatar_url, _id } = usefulData.user;

      return request
        .get(`/api/users/${username}`)
        .expect(200)
        .then(res => {
          expect(res.body.userData.username).to.equal(username);
          expect(res.body.userData.name).to.equal(name);
          expect(res.body.userData.avatar_url).to.equal(avatar_url);
          expect(res.body.userData._id).to.equal(`${_id}`);
          expect(res.body.userArticles).to.be.an('array');
          expect(res.body.userArticles.length).to.equal(0);
          expect(res.body.userComments).to.be.an('array');
          expect(res.body.userComments).to.be.an('array');
          expect(res.body.userComments.length).to.equal(4);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      const username = 'adie';

      return request
        .get(`/api/users/${username}`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal(`No-one is using the username ${username}`);
        });
    });
  });
  describe('unexpected routes get 404', () => {
    it('returns 404 for /stuff', () => {
      const url = '/stuff';
      return request
        .get(url)
        .expect(404)
        .then(res => {
          expect(res.body.status).to.equal(404);
          expect(res.body.msg).to.equal(`${url} is not a valid path`);
        });
    });
    it('returns 404 for /api/allThings', () => {
      const url = '/api/allThings';
      return request
        .get(url)
        .expect(404)
        .then(res => {
          expect(res.body.status).to.equal(404);
          expect(res.body.msg).to.equal(`${url} is not a valid path`);
        });
    });
  });
});
