const User = require('../models/User');
const { verifyToken } = require('../utils/token');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = req.cookies?.token;

    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized. Missing token.');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('Not authorized. User not found.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

module.exports = {
  protect,
};
