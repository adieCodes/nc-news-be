const app = require('./server');

const { PORT } = process.env;

app.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`listening on port ${PORT}`);
});
