/* eslint-disable no-underscore-dangle, arrow-body-style, camelcase */

process.env.NODE_ENV = 'test';

const app = require('../server');
const { describe, it, beforeEach } = require('mocha');
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
  });
  describe('GET /api/topics/:topid/articles', () => {
    it('returns 200 and all articles for matching topic', () => {
      return request
        .get(`/api/topics/football/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(1);
          expect(res.body.articles[0].title).to.be.a('string');
          expect(res.body.articles[0].body).to.be.a('string');
          expect(res.body.articles[0].votes).to.be.a('number');
        });
    });
    it('returns 404 for invalid topic', () => {
      return request
        .get(`/api/topics/tennis/articles`)
        .expect(404)
        .then(res => {
          expect(res.body.status).to.equal(404);
          expect(res.body.msg).to.equal('No content');
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
      return request
        .get('/api/articles/1')
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal('Invalid Id');
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
    it('returns 404 and msg if no comments', () => {
      return request
        .get('/api/articles/1/comments')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('There are no comments for this article yet');
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
        .expect(201) /* 201 */
        .then(res => {
          expect(res.body.comments.length).to.equal(commentCountPrePost + 1);
          expect(res.body.comments[commentCountPrePost].body).to.equal(commentContent);
          expect(res.body.comments[0].belongs_to).to.equal(`${articleId}`);
        });
    });
    it('returns 400 and msg if no comments', () => {
      return request
        .post('/api/articles/1/comments')
        .send({ comment: commentContent })
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal('Invalid article Id');
        });
    });
  });
  describe('PUT /api/articles/:articleId', () => {
    it('returns 200, increments vote and returns article', () => {
      const { _id, title, body, belongs_to } = usefulData.articles[0];
      const voteCountPrePost = usefulData.articles[0].votes;

      return request
        .put(`/api/articles/${_id}?vote=up`)
        .expect(200) /* 201 */
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
        .expect(200) /* 201 */
        .then(res => {
          expect(res.body.article.votes).to.equal(voteCountPrePost - 1);
          expect(res.body.article.title).to.equal(title);
          expect(res.body.article.body).to.equal(body);
          expect(res.body.article.belongs_to).to.equal(belongs_to);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      return request
        .put(`/api/articles/1?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal('Invalid Article ID');
        });
    });
  });
  describe('PUT /api/comments/:comment', () => {
    it('returns 200, increments vote and returns article', () => {
      const { _id, belongs_to, created_by, body } = usefulData.comments[0];
      const voteCountPrePost = usefulData.comments[0].votes;

      return request
        .put(`/api/comments/${_id}?vote=up`)
        .expect(200) /* 201 */
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
        .expect(200) /* 201 */
        .then(res => {
          expect(res.body.comment.votes).to.equal(voteCountPrePost - 1);
          expect(res.body.comment.belongs_to).to.equal(`${belongs_to}`);
          expect(res.body.comment.created_by).to.equal(created_by);
          expect(res.body.comment.body).to.equal(body);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      return request
        .put(`/api/comments/1?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal('Invalid Article ID');
        });
    });
  });
  describe('DELETE /api/comments/:comment', () => {
    it('returns 200, deletes comment and returns article', () => {
      const { _id, votes, belongs_to, created_by, body } = usefulData.comments[0];

      return request
        .delete(`/api/comments/${_id}`)
        .expect(200) /* 201 */
        .then(res => {
          expect(res.body.comment.votes).to.equal(votes);
          expect(res.body.comment.belongs_to).to.equal(`${belongs_to}`);
          expect(res.body.comment.created_by).to.equal(created_by);
          expect(res.body.comment.body).to.equal(body);
        });
    });
    it('returns 400 and msg if invalid articleId', () => {
      return request
        .delete(`/api/comments/1`)
        .expect(400)
        .then(res => {
          expect(res.body.status).to.equal(400);
          expect(res.body.msg).to.equal('Invalid Comment ID');
        });
    });
  });
});
describe('#server', () => {
  it('complete final check and disconnect', () => {
    return request
      .get('/')
      .expect(200)
      .then(res => {
        expect(res.body.msg).to.be.equal('Server running on port 3090');
        mongoose.disconnect();
      });
  });
});
