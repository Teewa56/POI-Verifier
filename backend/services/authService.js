const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = async (user, statusCode, res) => {
    const token = signToken(user._id);
    const refreshToken = crypto.randomBytes(32).toString('hex');

    await Token.create({
        token: refreshToken,
        user: user._id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        refreshToken,
        data: {
            user,
        },
    });
};

const verifyToken = async (token) => {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
        throw new AppError('The user belonging to this token does no longer exist.', 401);
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        throw new AppError('User recently changed password! Please log in again.', 401);
    }

    return currentUser;
};

const refreshToken = async (refreshToken) => {
    const storedToken = await Token.findOne({ 
        token: refreshToken,
        expires: { $gt: Date.now() }
    });

    if (!storedToken) {
        throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await User.findById(storedToken.user);
    if (!user) {
        throw new AppError('User no longer exists', 401);
    }

    await Token.findByIdAndDelete(storedToken._id);
    return user;
};

module.exports = {
    signToken,
    createSendToken,
    verifyToken,
    refreshToken,
};