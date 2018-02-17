/* eslint-disable no-console */

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const apiRouter = require('./routes');

const PORT = config.PORT[process.env.NODE_ENV];
const DB = config.DB[process.env.NODE_ENV];

mongoose.Promise = global.Promise;

mongoose
  .connect(DB)
  .then(console.log('successfully connected to db', DB))
  .catch(err => console.log('connection failed', err));

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send({ msg: `Server running on port ${PORT}` }));
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (err.status === 400) return res.status(400).send(err);
  if (err.status === 404) return res.status(404).send(err);
  return next();
});
app.use((err, req, res) => res.status(500).send({ err }));

module.exports = app;
