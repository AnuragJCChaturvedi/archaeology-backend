require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize());
require('./config/passport');

// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   // res.append(
//   //   'Access-Control-Allow-Methods',
//   //   'GET,PUT,POST,DELETE,PATCH,OPTIONS'
//   // );
//   // res.append(
//   //   'Access-Control-Allow-Headers',
//   //   'Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Referer, User-Agent'
//   // );
//   next();
// });

// For UpTime
app.get('/', (req, res) =>
  res.status(200).json({
    success: true,
  })
);

app.use('/user', require('./app/routes/user'));

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  res.status(status);

  if (status === 500) {
    console.error(err);
    err.message = 'Internal Server Error';
  }

  res.send({
    code: status,
    payload: {
      success: false,
      message: err.message || err,
    },
  });
});

app.listen(3001, (req, res) => {
  console.log('App started and working!');
});
