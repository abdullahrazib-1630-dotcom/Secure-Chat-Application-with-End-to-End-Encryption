const jwt = require('jsonwebtoken');

const getJwtOptions = () => ({
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
});

const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, getJwtOptions());
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  signToken,
  verifyToken,
};
