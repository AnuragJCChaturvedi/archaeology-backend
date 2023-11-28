const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const helpers = require('../helpers/user');
// const TeamCtrl = require('../controllers/team_controller');
// const team_helper = require('../helpers/team_helper');

// router.post(
//   '/createTeam',
//   appHelper.authenticateCustomer(),
//   function (req, res) {
//     const customer = appHelper.getCustomer(req.headers);
//     TeamCtrl.createTeam(req.body.displayName, req.body.websiteUrl, customer)
//       .then((data) =>
//         res.json({
//           code: 200,
//           payload: data,
//         })
//       )
//       .catch((err) => {
//         return appHelper.sendErrorStatus(res, err);
//       });
//   }
// );

router.get(
  '/validate-token',
  helpers.authenticateCustomer(),
  (req, res, next) => {
    res.json({
      code: 200,
      payload: { success: true },
    });
  }
);

router.get('/login', async (req, res, next) => {
  try {
    const token = await userCtrl.login({ ...req.query });
    if (!token) {
      return res.json({
        code: 200,
        payload: { success: false, message: 'Incorrect username or password' },
      });
    }

    return res.json({
      code: 200,
      payload: { success: true, token: 'Bearer ' + token },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    await userCtrl.register({ ...req.body });
    return res.json({
      code: 200,
      payload: { success: true },
    });
  } catch (err) {
    next(err);
  }
});

router.get(
  '/protected-route',
  helpers.authenticateCustomer(),
  async (req, res, next) => {
    try {
      return res.json({
        code: 200,
        payload: {
          msg: 'token is valid',
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
