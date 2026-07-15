const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');

  const jti = crypto.randomUUID();
  const token = jwt.sign({ ...payload, jti }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

  return { token, jti };
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
