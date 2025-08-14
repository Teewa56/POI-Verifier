const authService = require('../services/authService');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const AppError = require('../utils/appError');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.getProfile = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) throw new AppError('User not found', 404);
        res.status(200).json({
            status: 'success',
            user
        });
    } catch (error) {
        next(new AppError(err.message, 500));
    }
}

exports.signup = async (req, res, next) => {
    console.log(req.body.userData);
    try {
        const existingUser = await User.findOne({email: req.body.userData.email});
        if(existingUser){
            throw new AppError('User Already Exists', 400);
        }
        const hashedPassword = await bcrypt.hash(req.body.userData.password, 13);
        const newUser = await User.create({
            name: req.body.userData.name,
            email: req.body.userData.email,
            password: hashedPassword,
        });

        await authService.createSendToken(newUser, 201, res);
    } catch (err) {
        console.log(err);
        next(new AppError(err.message, 500));
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Please provide email and password', 400);
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Incorrect email or password', 401);
        }

        await authService.createSendToken(user, 200, res);
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};

exports.loginWithGooogle = async (req, res, next) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();

        const email = payload.email;
        const user = await User.findOne({ email });

        if (!user) {
            const newUser = await User.create({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                provider: 'google'
            });
            await authService.createSendToken(newUser, 201, res);
        }else{
            await authService.createSendToken(user, 200, res);
        }
    } catch (error) {
        next(new AppError(err.message, 500));
    }
};


exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            throw new AppError('Please provide refresh token', 400);
        }

        const user = await authService.refreshToken(refreshToken);
        await authService.createSendToken(user, 200, res);
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};

exports.logout = async (req, res, next) => {
    try {
        if (req.body.refreshToken) {
        await Token.findOneAndDelete({ token: req.body.refreshToken });
        }

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    } catch (err) {
        next(new AppError('Error during logout', 500));
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new AppError('There is no user with that email address.', 404);
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `${req.protocol}://${req.get(
        'host'
        )}/api/v1/users/resetPassword/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`,
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!',
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            throw new AppError('There was an error sending the email. Try again later!', 500);
        }
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new AppError('Token is invalid or has expired', 400);
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        await authService.createSendToken(user, 200, res);
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};