const authService = require('./auth.service');

const register = async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};

module.exports = { register, login };
