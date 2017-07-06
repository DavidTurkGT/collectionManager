const express         = require('express');
const mustacheExpress = require("mustache-express");
const routes          = require('./routes/router.js');
const path            = require('path');
const bodyParser      = require('body-parser');
const validator       = require('express-validator');
////////////////////////////////////////////////////////////////////////////////
const app = express ();
app.set('port' , (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname,'public')));

app.engine('mustache', mustacheExpress())

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'mustache');

app.set('layout','layout');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(validator());

app.use(routes);
////////////////////////////////////////////////////////////////////////////////
app.listen(app.get('port'), () => {
  console.log("App running on port ", app.get('port'));
})
