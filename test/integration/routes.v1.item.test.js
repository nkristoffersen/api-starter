process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../src/server/app');
const knex = require('../../src/server/db/connection');

chai.use(chaiHttp);

describe('Routes.V1.Item', () => {

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

  describe('POST /api/v1/item/create', () => {
    it('should return a success for creating a item', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .post('/api/v1/item/create')
            .set('auth_token', response.body.data.token)
            .send({
              name: 'first item'
            })
            .end((err, res) => {
              should.not.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(201);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Item creation success');
              done();
            });
        });
    });
    it('should throw an error if a user is not logged in while trying to create a resume', (done) => {
      chai.request(server)
        .post('/api/v1/item/create')
        .send({
          name: 'first item'
        })
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(401);
          done();
        });
    });
  });

  describe('GET /api/v1/item/', () => {
    it('should return a success and an array of all items for user', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .get('/api/v1/item/')
            .set('auth_token', response.body.data.token)
            .end((err, res) => {
              should.not.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Get all items success');
              res.body.data.length.should.eql(2);
              done();
            });
        });
    });
    it('should throw an error if a user is not logged in while trying to get all items', (done) => {
      chai.request(server)
        .get('/api/v1/item/')
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(401);
          done();
        });
    });
  });

  describe('GET /api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb', () => {
    it('should return a single item', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .get('/api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb')
            .set('auth_token', response.body.data.token)
            .end((err, res) => {
              should.not.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Get item by id success');
              res.body.data.id.should.eql('a7754607-923e-403f-8998-c5d310fa29fb');
              done();
            });
        });
    });
    it('should throw an error if requesting a item that does not exist', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .get('/api/v1/item/467a9a46-d613-41a1-a358-a44cc9831da1')
            .set('auth_token', response.body.data.token)
            .end((err, res) => {
              should.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(404);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Item not found');
              done();
            });
        });
    });
  });

  describe('PUT /api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb', () => {
    it('should update a single item', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .put('/api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb')
            .set('auth_token', response.body.data.token)
            .send({
              name: 'updated item name'
            })
            .end((err, res) => {
              should.not.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Update item by id success');
              res.body.data.updatedCount.should.eql(1);
              done();
            });
        });
    });
    it('should throw an error if updating a item that does not exist', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .put('/api/v1/item/467a9a46-d613-41a1-a358-a44cc9831da1')
            .set('auth_token', response.body.data.token)
            .send({
              name: 'updated item name'
            })
            .end((err, res) => {
              should.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(404);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Item not found');
              done();
            });
        });
    });
    // it('should throw an error if updating a resume with invalid json resume', (done) => {
    //   chai.request(server)
    //     .post('/api/v1/auth/login')
    //     .send({
    //       email: 'jeremy@example.com',
    //       password: 'johnson123'
    //     })
    //     .then((response) => {
    //       chai.request(server)
    //         .put('/api/v1/resume/a7754607-923e-403f-8998-c5d310fa29fb')
    //         .set('auth_token', response.body.data.token)
    //         .send({
    //           name: 'updated display name',
    //           json_resume: invalidJsonResume
    //         })
    //         .end((err, res) => {
    //           should.exist(err);
    //           res.redirects.length.should.eql(0);
    //           res.status.should.eql(400);
    //           res.type.should.eql('application/json');
    //           res.body.statusMessage.should.eql('Resume is not valid');
    //           res.body.data[0].code.should.eql('INVALID_TYPE');
    //           done();
    //         });
    //     });
    // });
    // it('should throw an error if updating a item that does not belong to user', (done) => {
    //   chai.request(server)
    //     .post('/api/v1/auth/login')
    //     .send({
    //       email: 'kelly@example.com',
    //       password: 'bryant123'
    //     })
    //     .then((response) => {
    //       chai.request(server)
    //         .put('/api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb')
    //         .set('auth_token', response.body.data.token)
    //         .send({
    //           name: 'Non-owner trying to update item name'
    //         })
    //         .end((err, res) => {
    //           console.log(res.body)
    //
    //           should.exist(err);
    //           res.redirects.length.should.eql(0);
    //           res.status.should.eql(404);
    //           res.type.should.eql('application/json');
    //           res.body.statusMessage.should.eql('Item not found');
    //           done();
    //         });
    //     });
    // });
    it('should throw an error if a user is not logged in while trying to update a single item', (done) => {
      chai.request(server)
        .put('/api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb')
        .send({
          name: 'updated item name'
        })
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(401);
          done();
        });
    });
  });

  describe('DELETE /api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb', () => {
    it('should delete a single item to say deleted:true', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .delete('/api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb')
            .set('auth_token', response.body.data.token)
            .end((err, res) => {
              should.not.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Delete item by id success');
              done();
            });
        });
    });
    it('should throw an error if deleting a item that does not exist', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123'
        })
        .then((response) => {
          chai.request(server)
            .delete('/api/v1/item/467a9a46-d613-41a1-a358-a44cc9831da1')
            .set('auth_token', response.body.data.token)
            .end((err, res) => {
              should.exist(err);
              res.redirects.length.should.eql(0);
              res.status.should.eql(404);
              res.type.should.eql('application/json');
              res.body.statusMessage.should.eql('Item not found');
              done();
            });
        });
    });
    it('should throw an error if a user is not logged in while trying to delete a single item', (done) => {
      chai.request(server)
        .delete('/api/v1/item/a7754607-923e-403f-8998-c5d310fa29fb')
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(401);
          done();
        });
    });
  });

});
