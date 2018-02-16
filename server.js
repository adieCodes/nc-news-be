if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = require('./config').PORT[process.env.NODE_ENV];

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send({ msg: `Server running on port ${PORT}` }));

module.exports = app;
