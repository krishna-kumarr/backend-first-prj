const catchAsyncError = require("../middlewares/catchAsyncError")
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandling");
const sendToken = require("../utils/jwt");
const crypto = require('crypto');

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar, role } = req.body;

    const user = await User.create({ name, email, password, avatar, role });

    sendToken(user, 201, res);
});


exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("please enter email & password", 401));
    }

    //finding user data in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 201, res);
})

exports.logOutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'logout successfull'
    })
}

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email"), 404);
    }

    const resetToken = user.getResetToken();
    user.save({ validateBeforeSave: false });

    //Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reser url is as follow \n\n
    ${resetUrl} \n\n If you have not requested this email, ignore it`

    try {
        sendEmail({
            email: user.email,
            subject: "Krishnacart reset password",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(err.message), 500);
    }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    });

    if (!user) {
        return next(new ErrorHandler('password reset token is invalid or expired'), 401)
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('password does not match'), 401)
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave: false});

    sendToken(user, 201, res);
})