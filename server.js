const mysql = require('mysql2');
const dotenv = require('dotenv');
const retry = require('retry'); // Add retry library
dotenv.config({ path: './config.env' });

const port = process.env.PORT;

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION!');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION!');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);


    function createDbConnection() {
        return mysql.createConnection({
            host: 'mysqldb',
            user: process.env.DB_DEV_USERNAME,
            password: process.env.DB_DEV_PWD,
            database: process.env.DB_DEV_NAME,
        });
    }

    const operation = retry.operation({
        retries: 30, // Number of retry attempts // Exponential backoff factor
        minTimeout: 3000 // Minimum delay between retries (in milliseconds)
    });
    // Retry connecting to MySQL database waits for the db container to be up and running
    operation.attempt(currentAttempt => {
        const db = createDbConnection();

        db.connect(err => {
            if (operation.retry(err)) {
                console.error(`Error connecting to MySQL (attempt ${currentAttempt}):`, err);
                return;
            }

            if (err) {
                console.error('Error connecting to MySQL after retrying:', err);
                return;
            }

            console.log('Connected to MySQL database');

            app.locals.db = db;

        });
    });
});
