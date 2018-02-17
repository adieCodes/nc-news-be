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
