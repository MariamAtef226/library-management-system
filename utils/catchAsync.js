// a function to catch asynchronous errors instead of the try catch blocks
function catchAsync(fun) {
    return (req, res, next) => {
        fun(req, res, next).catch(next); // async function therefore, returns a promise --> catch the error
    }
}

module.exports = catchAsync;