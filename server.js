if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

const PORT = config.PORT[process.env.NODE_ENV];
const db = config.DB[process.env.NODE_ENV];

mongoose.Promise = global.Promise;

mongoose
  .connect(db)
  .then(console.log('successfully connected to db', db))
  .catch(err => console.log('connection failed', err));

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send({ msg: `Server running on port ${PORT}` }));

module.exports = app;
