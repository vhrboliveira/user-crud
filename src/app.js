const express = require('express');
const cors = require('cors');
const { connect } = require('./database/Connection');

connect();

const { routes } = require('./routes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);

module.exports = {
  app,
};
