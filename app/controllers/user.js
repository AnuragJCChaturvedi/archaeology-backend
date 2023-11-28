const models = require('archaeology-models');
const { hash, compare } = require('bcrypt');
const { errCodeWithMsg } = require('../helpers/common');
const jwt = require('jsonwebtoken');

class UserCtrl {
  async login({ email, password }) {
    const user = await models.user.findOne({
      include: [{ model: models.role, attributes: ['name'] }],
      where: { email, isActive: true },
    });
    if (!user) errCodeWithMsg({ code: 200, msg: "User doesn't exist" });
    if (await compare(password, user.dataValues.password)) {
      const payload = {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        role: user.dataValues.role.dataValues.name,
      };
      return await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
    }
    return false;
  }

  async register({ name, email, password, role }) {
    const encryptedPwd = await hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const existingUser = await models.user.findOne({ where: { email } });
    if (existingUser) errCodeWithMsg({ code: 200, msg: 'User already exist' });
    console.log(role);
    const roleObj = await models.role.findOne({ where: { name: role } });
    console.log(roleObj);
    if (!roleObj) errCodeWithMsg({ code: 200, msg: 'Role does not exist' });
    await models.user.create({
      name,
      email,
      password: encryptedPwd,
      roleId: roleObj.id,
    });
  }
}

module.exports = new UserCtrl();
