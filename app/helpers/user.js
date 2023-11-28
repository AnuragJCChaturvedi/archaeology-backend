const jwt = require('jwt-simple');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');

const authenticateCustomer = () => {
  const passportJWTCheck = passport.authenticate('jwt', { session: false });
  const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
  console.log('Hello bro');
  return async (req, res, next) => {
    // First check with old middleware that
    // provided JWT token is valid
    console.log('My name is khannnn', tokenExtractor, req);
    passportJWTCheck(req, res, async (err) => {
      try {
        console.log('My name is khan');
        if (err) return next(err);
        // If token is v2 then check with auth server
        // 1. Extract token
        const token = tokenExtractor(req);
        // 2. Decode token
        const decoded = jwt.decode(token, process.env.JWT_SECRET, true);

        console.log('Decoded tokens: ', decoded);

        return next();
      } catch (e) {
        console.log('Token validating error: ', e);
        return next(e);
      }
    });
  };
};

module.exports = {
  authenticateCustomer,
};
