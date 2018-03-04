/* eslint-disable no-console */

const app = require('./server');
const config = require('./config');

const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;

app.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`listening on port ${PORT}`);
});
