process.env.NODE_ENV = 'test';

const app = require('../server');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const supertest = require('supertest');

const request = supertest(app);

describe('API', () => {
  describe('#server', () => {
    it('server is running', () => {
      return request
        .get('/')
        .expect(200)
        .then(res => {
          expect(res.body.msg).to.be.equal('Server running on port 3090');
        });
    });
  });
});
