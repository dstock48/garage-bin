const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 8488);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})


app.listen(app.get('port'), () => {
  const portNum = app.get('port')
  console.log(`Garage Bin is running on http://localhost:${portNum}`);
})
