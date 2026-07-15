const crypto = require('crypto');

const issueCsrfToken = (res) => {
  const token = crypto.randomBytes(24).toString('hex');
  res.cookie('csrfToken', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};

const csrfProtection = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  const csrfHeader = req.headers['x-csrf-token'];
  const csrfCookie = req.cookies.csrfToken;

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return res.status(403).json({ success: false, message: 'CSRF token mismatch' });
  }

  return next();
};

module.exports = { issueCsrfToken, csrfProtection };
