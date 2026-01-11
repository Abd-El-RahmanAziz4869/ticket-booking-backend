const AppError = require('../errors/AppError');

module.exports = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    next(new AppError('Invalid request data', 400));
  }
};
