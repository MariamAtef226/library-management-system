const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const {protect } = require('./controllers/authController')

// Routers
const bookRouter = require("./routes/bookRoutes");
const borrowerRouter = require("./routes/borrowerRoutes");
const borrowingProcessRouter = require("./routes/borrowingProcessRoutes");
const statisticsRouter = require("./routes/statisticsRoutes")
const adminRouter = require("./routes/adminRoutes");


const app = express();

// 1st: SECURITY MIDDLEWARES:

// SET SECURITY HEADERS FOR HTTP
app.use(helmet()); // preferred to be at the top of the middlewares

// LIMITING REQUESTS RATE
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP! Please try again in an hour'
});
app.use('/api', limiter);

// BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({ limit: '10kb' })); // applied body size limit 

// DATA SANITIZATION AGAINST XSS ATTACKS - malicious input HTML by user
app.use(xssClean());

// DEVELOPMENT ENVIRONMENT STATUS LOG
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use(bodyParser.json());

// Define Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Library-management-system API',
            version: '1.0.0',
            description: 'API documentation',
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define your API routes
app.use('/api/v1/books', protect, bookRouter);
app.use('/api/v1/borrowers',protect,  borrowerRouter);
app.use('/api/v1/borrowingProcesses', protect, borrowingProcessRouter);
app.use('/api/v1/statistics', protect, statisticsRouter);
app.use('/api/v1/admins',adminRouter);

app.all('*', (req, res, next) => {
    next(new AppError("Can't find " + req.originalUrl + " on this server!", 404));
});

app.use(globalErrorHandler);
module.exports = app;
