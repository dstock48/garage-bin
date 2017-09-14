const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should(); // eslint-disable-line
const server = require('../server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHttp);

describe('API endpoints', () => {

});
