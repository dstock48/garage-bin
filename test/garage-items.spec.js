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

});
