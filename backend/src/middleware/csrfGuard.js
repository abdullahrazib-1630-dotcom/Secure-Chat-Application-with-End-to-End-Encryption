const allowedOrigins = (process.env.CLIENT_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const stateChangingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const csrfGuard = (req, res, next) => {
  if (!stateChangingMethods.has(req.method)) {
    return next();
  }

  if (allowedOrigins.length === 0) {
    return next();
  }

  const origin = req.get('origin');
  const referer = req.get('referer');

  const validOrigin = origin && allowedOrigins.includes(origin);
  const validReferer =
    referer && allowedOrigins.some((allowedOrigin) => referer.startsWith(allowedOrigin));

  if (!validOrigin && !validReferer) {
    return res.status(403).json({
      success: false,
      message: 'Invalid request origin',
    });
  }

  return next();
};

module.exports = csrfGuard;
