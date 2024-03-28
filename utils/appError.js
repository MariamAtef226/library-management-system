class AppError extends Error{
    constructor(message,statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4')?'fail':'error';
        this.isOperational = true; // might be programming error, then it wont have this property (special to our new class)
        // use it to distinguish between operational and programming errors
        Error.captureStackTrace(this,this.connstructor) // eliminate errors from this class to the error stack
    }
}

module.exports = AppError