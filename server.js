/* eslint-disable no-console */

// TODO: If !config.DB_URI use process.env.DB_URI

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const apiRouter = require('./routes');

const DB_URI = config.DB[process.env.NODE_ENV] || process.env.DB_URI;

mongoose.Promise = global.Promise;

mongoose
  .connect(DB_URI)
  .then(console.log('successfully connected to DB'))
  .catch(err => console.log('connection failed', err));

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use('/', express.static('public'));
app.use('/api', apiRouter);
app.get('*', (req, res, next) => {
  next({ status: 404, msg: `${req.url} is not a valid path` });
});

app.use((err, req, res, next) => {
  if (err.status === 400) return res.status(400).send(err);
  if (err.status === 404) return res.status(404).send(err);
  return next();
});
app.use((err, req, res) => res.status(500).send({ err }));

module.exports = app;
