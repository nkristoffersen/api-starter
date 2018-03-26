process.env.NODE_ENV = 'test';
const jwt = require('jsonwebtoken');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../src/server/app');
const knex = require('../../src/server/db/connection');

chai.use(chaiHttp);

describe('Routes.V1.User', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run();
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/user', () => {
    it('should return a success', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .get('/api/v1/user')
            .set('auth_token', response.body.data.token)
            .end((err, res) => {
              should.not.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Get user success');
              done();
            });
        });
    });
    it('should throw an error if a user is not logged in', (done) => {
      chai.request(server)
        .get('/api/v1/user')
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(401);
          done();
        });
    });
  });

});
