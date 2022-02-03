const request = require('supertest');
const assert = require('assert');
const express = require('express');
// const db = require('../server/models/brdlModels');

// const app = express();
const server = 'http://localhost:3000';

describe('route integration', () => {
  describe('/gainAccess', () => {
    describe('GET', () => {
      it('responds with 200 status and application/json content type', () =>
        request(server)
          .get('/gainAccess')
          .expect('Content-Type', /application\/json/)
          .expect(200));
    });

    describe('POST', () => {
      it('responds with 200 status and application/json content type', () =>
        request(server)
          .post('/api/gainAccess')
          .send({ username: 'ergo', password: 'ergo', fullname: 'Eric' })
          .expect('Content-Type', /application\/json/)
          .expect(200));
    });
  });
});
