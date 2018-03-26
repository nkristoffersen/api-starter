process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../src/server/app');
const knex = require('../../src/server/db/connection');

chai.use(chaiHttp);

describe('Routes.V1.Auth', () => {

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

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(server)
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.statusMessage.should.equal('Successfully registered user');
          done();
        });
    });
    it('should throw an error if the password is < 8 characters', (done) => {
      chai.request(server)
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'six'
        })
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.statusMessage.should.equal('Password must be longer than 8 characters');
          done();
        });
    });
    it('should throw an error if the email is not valid', (done) => {
      chai.request(server)
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example',
          password: 'hermanRegistered'
        })
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.statusMessage.should.equal('Email is not valid');
          done();
        });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should register a new user and then login the same user and test account id and ownership role is correct', (done) => {
      chai.request(server)
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered'
        })
        .then((response) => {
          chai.request(server)
            .post('/api/v1/auth/login')
            .send({
              email: 'michael@example.com',
              password: 'hermanRegistered'
            })
            .end((err, res) => {
              should.not.exist(err);
              res.redirects.length.should.equal(0);
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.statusMessage.should.equal('Successfully logged in user');
              res.body.data.user.id.should.equal(response.body.data.user.id);
              done();
            });
        });
    });
    it('should not login an unregistered user', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'michael@example.com',
          password: 'johnson123'
        })
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.type.should.eql('application/json');
          res.body.statusMessage.should.eql('User not found');
          done();
        });
    });
  });

  // describe('POST /api/v1/auth/forgot', () => {
  //   it('should send an email to user with reset token', (done) => {
  //     chai.request(server)
  //       .post('/api/v1/auth/forgot')
  //       .send({
  //         email: 'jeremy@example.com'
  //       })
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.redirects.length.should.equal(0);
  //         res.status.should.equal(200);
  //         res.type.should.equal('application/json');
  //         res.body.statusMessage.should.equal('Successfully sent password reset for user');
  //         done();
  //       });
  //   });
  //   it('should throw an error if email does not exist', (done) => {
  //     chai.request(server)
  //       .post('/api/v1/auth/forgot')
  //       .send({
  //         email: 'jeremy@example.org'
  //       })
  //       .end((err, res) => {
  //         should.exist(err);
  //         res.redirects.length.should.equal(0);
  //         res.status.should.equal(500);
  //         res.type.should.equal('application/json');
  //         res.body.data.message.should.equal('Could not find user with this email');
  //         done();
  //       });
  //   });
  // });
  // describe('POST /api/v1/auth/reset', () => {
  //   it('should throw an error if the token is bad', (done) => {
  //     chai.request(server)
  //       .post('/api/v1/auth/reset')
  //       .send({
  //         token:'a bad token',
  //         password: 'new password'
  //       })
  //       .end((err, res) => {
  //         should.exist(err);
  //         res.redirects.length.should.equal(0);
  //         res.status.should.equal(500);
  //         res.type.should.equal('application/json');
  //         res.body.data.message.should.equal('Please provide valid token');
  //         done();
  //       });
  //   });
  // });

});
