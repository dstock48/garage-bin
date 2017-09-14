const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should(); // eslint-disable-line
const server = require('../server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHttp);

describe('API endpoints', () => {

  beforeEach((done) => {
    db.migrate.rollback()
      .then(() => {
        db.migrate.latest()
          .then(() => {
            db.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('should return an error when hitting an invalid endpoint', (done) => {
    chai.request(server)
      .get('/api/v1/items') // <- invalid endpoint
      .end((err, res) => {
        res.should.have.status(404);
        res.error.text.should.include('Cannot GET /api/v1/items');
        done();
      });
  });

  it('should return an array of garage items', (done) => {
    chai.request(server)
      .get('/api/v1/item')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length(3);
        res.body.forEach(item => {
          item.should.have.property('item_name');
          item.should.have.property('reason');
          item.should.have.property('cleanliness');
        });
        done();
      });
  });

  it('should return an error when missing a required parameter', (done) => {
    chai.request(server)
      .post('/api/v1/item')
      .send({
        item_name: 'bleach',
        // reason: 'clean up red stains', <- missing parameter
        cleanliness: 'sparkling'
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.have.property('error');
        res.body.error.should.equal('Missing required parameter: reason');
        done();
      });
  });

  it('should add a new item to the database', (done) => {
    chai.request(server)
      .post('/api/v1/item')
      .send({
        item_name: 'bleach',
        reason: 'clean up red stains',
        cleanliness: 'sparkling'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('item_name');
        res.body.item_name.should.equal('bleach');
        res.body.should.have.property('reason');
        res.body.reason.should.equal('clean up red stains');
        res.body.should.have.property('cleanliness');
        res.body.cleanliness.should.equal('sparkling');
        done();
      });
  });

  it('should update the cleanliness value of an item in the database', (done) => {
    chai.request(server)
      .get('/api/v1/item')
      .end((err, res) => {
        res.body[0].item_name.should.eql('shovel');
        res.body[0].cleanliness.should.eql('dusty');

        chai.request(server)
          .patch('/api/v1/item')
          .send({
            id: 1,
            cleanliness: 'sparkling'
          })
          .end((err, res) => {
            res.body[0].item_name.should.eql('shovel');
            res.body[0].cleanliness.should.eql('sparkling');
            done();
          });
      });
  });

  it('should return an error if the updated cleanliness value is invalid', (done) => {
    chai.request(server)
      .get('/api/v1/item')
      .end((err, res) => {
        res.body[0].item_name.should.eql('shovel');
        res.body[0].cleanliness.should.eql('dusty');

        chai.request(server)
          .patch('/api/v1/item')
          .send({
            id: 1,
            cleanliness: 'squeaky-clean'
          })
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error.should.equal('SQUEAKY-CLEAN is not a valid cleanliness option. Please choose from the following: SPARKLING, DUSTY, RANCID.');
            done();
          });
      });
  });

});
