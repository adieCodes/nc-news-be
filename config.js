const { mlabsUrls } = require('./config.deployment');

module.exports = {
  PORT: {
    dev: 3000,
    test: 3090
  },
  DB: {
    dev: 'mongodb://localhost/nc-news',
    test: 'mongodb://localhost/nc-news-test',
    production: mlabsUrls
  }
};
