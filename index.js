const app = require('./server');

const PORT = require('./config').PORT[process.env.NODE_ENV];

app.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`listening on port ${PORT}`);
});
