const User = require('./user.model');
const { hashPassword, comparePassword } = require('../../common/utils/password');
const { signToken } = require('../../common/utils/jwt');

const register = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    email,
    passwordHash
  });

  return { id: user._id, email: user.email };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({
    userId: user._id,
    role: user.role
  });

  return { token };
};

module.exports = { register, login };
