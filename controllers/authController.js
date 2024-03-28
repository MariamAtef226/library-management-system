const util = require('util');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../DTO/userModel');
const AppError = require('../utils/appError');

const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');

const signToken = function (id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const createAndSendToken = function (user,code,res){
    const token = signToken(user._id);
    let cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        // secure:true, // cookie will only be sent on https connection - we need it only in production
        httpOnly:true // cookie can't be accessed or modified in anyway by browser
    }

    if (process.env.NODE_ENV === "production")
        cookieOptions.secure=true;
    res.cookie('jwt',token,cookieOptions);

    user.password = undefined // so that password isn't returned with request
    
    res.status(code).json({
        status: "success",
        token, // we shouldn't send the token in the request, but we'll keep it like that for now
        data:{
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    createAndSendToken(newUser,201,res);

});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(new AppError("please provide email and password for logging in!", 400));
        return;
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect password or email!', 401));
    }
    createAndSendToken(user,200,res);

})

// protect middleware --> to auhtneticate that user is actually logged in
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You\'re not logged in', 401));
    }

    let decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET) // bec jwt.verify isn't async func
    // it will be invalid when it expires or has been modified somehow

    // check if user still exists (bec if he's removed from system, no one can use his token to access page)
    let user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('The user of this token no longer exists', 401));
    }

    // check if user changed password after jwt was issued (lw et3mlo hacking, w ghyar password hghyrlo kol 7aga)
    if (await user.changedPassword(decoded.iat)) {
        return next(new AppError('This user have changed their password. Login again to generate new token', 401))
    }
    req.user = user; // in case we needed to be used in the next middleware function 
    next();
})

// to authroize access
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError('Unauthorized access to this function!', 403)); // 403 for authorization
        next();
    }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
    // 1) get user's email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('This user doesn\'t have an account!', 404));
    }

    // 2) generate random reset token
    let resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // we're leaving the passwordConfirmation empty (it was cleared in a document middleware before user saving) - so this won't pass the restricted validation
    
    // 3) send this token by email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = "Forgot your password? Submit a patch request with your new password and passwordCofnirm to: " + resetURL + "\n If you didn't request password reset, ignore the email";

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (only valid for 10 minutes)",
            message
        });
        res.status(200).json({
            status: "success",
            message: "token sent to email"
        });
    }
    catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiration = undefined;
        await user.save({validateBeforeSave:false});
        return next(new AppError('There was an error while sending the email. Try Again Later!',500)); // 500 because error occured on mail server
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken:hashedToken, passwordResetExpiration: {$gt:Date.now()} });

    // 2) if token has not expired, and there exists this user -- set the new password
    if (!user){
        return next(new AppError('Either user does\'t exist or expired token',400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiration = undefined;
    await  user.save();

    // 3) update changedPasswordAt Property for the user --> done in a middleware
    //4) log the user in and send JWT
    createAndSendToken(user,200,res);
[]
});

exports.updatePassword = catchAsync(async(req,res,next)=>{
    let user = await User.findById(req.user.id).select('+password');
    if (!user){
        return next(new AppError('User is not found',404));
    }
    let password = req.body.password;
    if (!(await user.correctPassword(password,user.password))){
        return next(new AppError('Invalid entered password!'),400);
    }
    // 3) if correct, update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await  user.save();

    // 4) update changedPasswordAt Property for the user -- in a middleware

    // 5) log the user in and send JWT
    createAndSendToken(user,200,res);
});