const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const { AppError } = require('./errorController');
const { verifyIdToken } = require('../services/googleAuthService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieExpires = parseInt(process.env.JWT_COOKIE_EXPIRES || '7', 10);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: cookieExpires * 24 * 60 * 60 * 1000
  });
  const safeUser = { ...user.toObject(), password: undefined };
  res.status(statusCode).json({ status: 'success', token, user: safeUser });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return next(new AppError('All fields are required', 400));
    const existing = await User.findOne({ email });
    if (existing) return next(new AppError('Email already in use', 400));
    const user = await User.create({ name, email, password, provider: 'local' });
    createSendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Provide email and password', 400));
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return next(new AppError('Missing Google idToken', 400));

    const profile = await verifyIdToken(idToken);
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      // Create a local shadow account for Google user
      const randomPass = crypto.randomBytes(24).toString('hex');
      user = await User.create({
        name: profile.name,
        email: profile.email,
        password: randomPass,
        provider: 'google',
        googleId: profile.googleId
      });
    } else if (!user.googleId) {
      // Link existing local account to google
      user.provider = 'google';
      user.googleId = profile.googleId;
      await user.save();
    }

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  res.cookie('jwt', 'loggedout', { httpOnly: true, expires: new Date(Date.now() + 10 * 1000) });
  res.status(200).json({ status: 'success' });
};

exports.refreshToken = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.jwt) return next(new AppError('No token cookie found', 401));
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User not found', 404));
    createSendToken(user, 200, res);
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ status: 'success', user });
  } catch (err) {
    next(err);
  }
};
