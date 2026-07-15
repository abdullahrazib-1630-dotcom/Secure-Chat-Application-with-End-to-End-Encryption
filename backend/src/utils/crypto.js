const crypto = require('crypto');

const hashValue = (value) => crypto.createHash('sha256').update(value).digest('hex');

const generateRandomToken = (size = 32) => crypto.randomBytes(size).toString('hex');

module.exports = {
  hashValue,
  generateRandomToken,
};
