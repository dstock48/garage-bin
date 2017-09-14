const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);

app.set('port', process.env.PORT || 8488);

// MIDDLEWARE /////////////////////////////////
///////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// STATIC FILES ///////////////////////////////
///////////////////////////////////////////////

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// ENDPOINTS //////////////////////////////////
///////////////////////////////////////////////

// GET //////////////
app.get('/api/v1/item', (req, res) => {
  db('garage').select()
    .then(items => {
      res.status(200).json(items);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// POST /////////////
app.post('/api/v1/item', (req, res) => {
  const newItem = req.body;

  for (let requiredParam of ['item_name', 'reason', 'cleanliness']) {
    if (!newItem[requiredParam]) {
      return res.status(422).json({ error: `Missing required parameter: ${requiredParam}`});
    }
  }

  db('garage').insert(newItem, '*')
    .then(item => {
      res.status(201).json(item[0]);
    })
    .catch( err => {
      res.status(500).json({ err });
    });
});

// PATCH ////////////
app.patch('/api/v1/item', (req, res) => {
  const updatedItem = req.body;
  const validCleanlinessOptions = ['sparkling', 'dusty', 'rancid'];

  if (updatedItem.cleanliness) {
    updatedItem.cleanliness = updatedItem.cleanliness.toLowerCase();
  }

  if (!validCleanlinessOptions.includes(updatedItem.cleanliness)) {
    const capCleanlinessOption = updatedItem.cleanliness.toUpperCase();
    const capValidOptions = validCleanlinessOptions.map(o => ` ${o.toUpperCase()}`);

    return res.status(422).json({
      error: `${capCleanlinessOption} is not a valid cleanliness option. Please choose from the following:${capValidOptions}.`
    });
  }

  db('garage').where({id: updatedItem.id}).update(updatedItem, '*')
    .then(item => {
      res.status(200).json(item);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// PORT LISTENER //////////////////////////////
///////////////////////////////////////////////

app.listen(app.get('port'), () => {
  const portNum = app.get('port');
  console.log(`Garage Bin is running on http://localhost:${portNum}`); // eslint-disable-line no-console
});

module.exports = app;
