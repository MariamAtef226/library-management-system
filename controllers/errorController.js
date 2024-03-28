const AppError = require("../utils/appError");

// MongoDB Error Handlers

function handleCastErrorDB(err) { 
    // Returned error object has 2 important attributes:
    // a) path attribute --> has the name of the property causing error
    // b) value attribute
    let message = `Invalid ${err.path}:${err.value}`;
    return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
    // there are not path and value in MongoErrors
    let value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    value = value.slice(1, value.length - 1);
    let key = Object.keys(err.keyValue).find(k => err.keyValue[k] === value) // get the field name
    let message = "Duplicate field value: " + value + " Please use another value for '" + key + "'!";
    return new AppError(message, 400)
}

function handleValidationErrorDB(err) {
    // there's an object called "errors" inside our error object --> it has all the validation erros
    // loop over it to get all of them
    let errors = Object.values(err.errors).map(el=>el.message); // make an array of values only, no keys + to get message, value.message
    errors = errors.join(' + ');
    let message = `Invalid Input Data: ${errors}`;
    return new AppError(message, 400)
}


function sendErrorDev(err, res) {
    return (res.status(err.statusCode).json(
        {
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        }
    ))
}

function sendErrorProd(err, res) {
    if (err.isOperational) {
        return (res.status(err.statusCode).json(
            {
                status: err.status,
                message: err.message
            }
        ))
    }
    else {
        // log the error
        console.error('ERROR!', err);
        // send to user a generic message
        return (res.status(500).json(
            {
                status: "error",
                message: "Something went wrong"
            }
        ))
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // 500 is internal server error
    err.status = err.status || "error"; // the error msg of 500

    if (process.env.NODE_ENV == "development")
        sendErrorDev(err, res);
    else {
        let error = err;
        if (err.name == "CastError")
            error = handleCastErrorDB(err);
        else if (err.code == 11000)
            error = handleDuplicateFieldsDB(err);
        else if (err.name=="ValidationError")
            error = handleValidationErrorDB(err);
        else if (err.name =="JsonWebTokenError")
            error = new AppError("Invalid Token! please login again", 401);
        else if (err.name =="TokenExpiredError")
                error =new AppError("This token has expired! Try to log in again",401);
    
        sendErrorProd(error, res);
    }
}