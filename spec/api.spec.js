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
