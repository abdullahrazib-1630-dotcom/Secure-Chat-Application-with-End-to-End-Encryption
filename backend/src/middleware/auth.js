const Session = require('../models/Session');
const User = require('../models/User');
const { verifyToken } = require('../utils/token');

const auth = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    const token = req.cookies.token || (bearer && bearer.startsWith('Bearer ') ? bearer.split(' ')[1] : null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const payload = verifyToken(token);
    const session = await Session.findOne({ jti: payload.jti, isRevoked: false });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = auth;
