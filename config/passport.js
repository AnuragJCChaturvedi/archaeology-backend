const passport = require('passport');
const models = require('archaeology-models');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { errCodeWithMsg } = require('../app/helpers/common');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const _newError = (message, code = 500) => {
  const err = new Error(message);
  err.status = code;
  return err;
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    return models.user
      .findOne({ where: { id: jwt_payload.id } })
      .then(function (user) {
        if (!user) {
          done(_newError('User does not exist', 404));
        } else {
          if (!user.isActive) {
            done(_newError('Please confirm your email.', 401));
          } else if (user.isDeleted) {
            return done(_newError('Account Deleted!', 404));
          } else {
            done(null, user);
          }
        }
      })
      .catch((err) => done(err));
  })
);
