/* eslint-disable no-underscore-dangle, arrow-body-style */

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

  describe('#API', () => {
    describe('GET /api/topics', () => {
      it('returns all topics', () => {
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
});
