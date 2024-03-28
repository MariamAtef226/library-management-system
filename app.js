const express = require('express')
const morgan = require('morgan') // dev dependency
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const bodyParser = require('body-parser');

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

// Routers
const bookRouter = require("./routes/bookRoutes")
const borrowerRouter = require("./routes/borrowerRoutes")
const borrowingProcessRouter = require("./routes/borrowingProcessRoutes")

const app = express();

// 1st: SECURITY MIDDLERWARES:

// SET SECURITY HEADERS FOR HTTP
app.use(helmet()) // prefered to be at the top of the middlewares

// LIMITING REQUESTS RATE
const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000,
    message:'Too many requests from this IP! please try again in an hour'
});
app.use('/api',limiter);

// BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({limit:'10kb'})); // applied body size limit 

// DATA SANITIZATION AGAINST XSS ATTACKS - malicious input html by user
app.use(xssClean());


// DEVELOPMENT ENVIRONMENT STATUS LOG
if (process.env.NODE_ENV === "development")
    app.use(morgan('dev'))


app.use(bodyParser.json());

app.use('/api/v1/books',bookRouter);
app.use('/api/v1/borrowers',borrowerRouter);
app.use('/api/v1/borrowingProcesses', borrowingProcessRouter)


app.all('*', (req, res, next) => {
    next(new AppError("can't find " + req.originalUrl + " on this server!", 400))
})

app.use(globalErrorHandler);
module.exports = app;
