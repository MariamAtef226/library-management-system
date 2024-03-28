const mysql = require('mysql2') // a mysql driver to connect node app to mysql
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const port = process.env.PORT;

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION!')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION!')
    console.log(err.name, err.message)
    process.exit(1);
});

const db = mysql.createConnection({
    host: 'mysqldb',
    user: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PWD,
    database: process.env.DB_DEV_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


const app = require('./app')


app.locals.db = db;

const server = app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})
