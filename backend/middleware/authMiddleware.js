const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { AppError } = require('../controllers/errorController');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) return next(new AppError('You are not logged in', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError('The user no longer exists', 401));

    req.user = { id: currentUser._id, role: currentUser.role, email: currentUser.email };
    next();
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('Forbidden', 403));
  next();
};

module.exports = { protect, restrictTo };
