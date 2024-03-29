const util = require('util');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AppError = require('../utils/appError');

const catchAsync = require('./../utils/catchAsync');

const signToken = function (id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const createAndSendToken = function (id, code, res) {
    const token = signToken(id);
    let cookieOptions = {
        expires: new Date(
            Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);

    res.status(code).json({
        status: "success",
        token // we shouldn't send the token in the request, but we'll keep it  here for the purpose of text in development 
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    let { name, email, password, passwordConfirm } = req.body

    // Check if all required fields are present
    if (!name || !email || !password || !passwordConfirm) {
        return next(new AppError('Name, Email, Password and Password confirmation all required', 400));
    }
    // check pwd and confirmation matching
    if (password != passwordConfirm) {
        return next(new AppError('Password and password confirmation do not match', 400));
    }
    // validate mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new AppError('Invalid email format', 400));
    }

    let pwd = await bcrypt.hash(password, 12);

    const db = req.app.locals.db;

    db.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, pwd], (err, result) => {
        if (err) return next(err.message, 500);
        createAndSendToken(result.insertId, 201, res);
    });

});


exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        next(new AppError("please provide email and password for logging in!", 400));
        return;
    }
    const db = req.app.locals.db;

    db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, rows) => {
        if (err) {
            return next(new AppError(err.message, 500));
        }

        // Check if user with the provided email exists
        if (rows.length === 0) {
            return next(new AppError('Incorrect email or password!', 401));
        }

        // Compare the provided password with the hashed password from the database
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next(new AppError('Incorrect email or password!', 401));
        }
        createAndSendToken(user.id, 200, res);
    });

});

// protect middleware --> to auhtneticate that user is actually logged in
exports.protect = catchAsync(async (req, res, next) => {

    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If token doesn't exist, return unauthorized error
    if (!token) {
        return next(new AppError('You\'re not logged in', 401));
    }
    // Verify the token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Query the MySQL database to find the user based on the user ID from the token
    const db = req.app.locals.db;
    db.query('SELECT * FROM admins WHERE id = ?', [decoded.id], async (err, rows) => {
        if (err) {
            return next(new AppError(err.message, 500));
        }

        // If user doesn't exist, return unauthorized error
        if (rows.length === 0) {
            return next(new AppError('The user of this token no longer exists', 401));
        }

        // Set the user object on the request object for use in subsequent middleware
        next();
    });
});



// to authroize access -- won't be used in the case of this project as there's no restriction on access (any registered user is an admin)
// exports.restrictTo = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role))
//             return next(new AppError('Unauthorized access to this function!', 403)); // 403 for authorization
//         next();
//     }
// }