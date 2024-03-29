const fs = require('fs');
const { parse } = require('json2csv');
const moment = require('moment');
const AppError = require("../utils/appError")

// Function to generate CSV file
function generateCSV(data, filename) {
    const csv = parse(data, { header: true });
    fs.writeFileSync(filename, csv);
}


// BONUS Task 1: Show analytical reports of borrowing process in a specific period and export data in CSV or Xlsx format
exports.getBorrowingProcessReport = async (req, res, next) => {
    const db = req.app.locals.db;
    const { startDate, endDate } = req.query; // Assuming start and end dates are provided in query params
    // Perform query to retrieve borrowing process data within the specified period
    db.query('SELECT * FROM borrowing_processes WHERE borrowed_at >= ? AND borrowed_at <= ?', [startDate, endDate], (err, result) => {
        if (err) return next(new AppError(err.message, 500))
        if (result.length === 0) {
            return next(new AppError("NO records were found to store in csv file for the last month", 400))
        }
        // Export borrowing process data to CSV
        const csvFilename = 'borrowing_process_report.csv';
        generateCSV(result, csvFilename);
        res.status(200).json({ status: 'Success', message: "Data is returned in borrowing_process_report.csv" });

    });
};

// BONUS Task 2: Export all overdue borrows of the last month
exports.exportOverdueBorrowsLastMonth = async (req, res, next) => {
    const lastMonthStartDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
    const lastMonthEndDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    const db = req.app.locals.db;

    db.query('SELECT * FROM borrowing_processes WHERE due_date between ? AND ? AND returned = false', [lastMonthStartDate, lastMonthEndDate], (err, results) => {
        if (err) return next(new AppError(err.message, 500))
        if (results.length === 0) {
            return next(new AppError("NO records were found to store in csv file for the last month", 400))
        }
        // Export overdue borrows data to CSV
        const csvFilename = 'overdue_borrows_last_month.csv';
        generateCSV(results, csvFilename);
        res.status(200).json({ status: 'Success', message: "Data is returned in overdue_borrows_last_month.csv" });

    });


};

// BONUS Task 3: Export all borrowing processes of the last month
exports.exportBorrowingProcessesLastMonth = async (req, res, next) => {
    const lastMonthStartDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
    const lastMonthEndDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    const db = req.app.locals.db;

    db.query('SELECT * FROM borrowing_processes WHERE due_date between ? AND ?', [lastMonthStartDate, lastMonthEndDate], (err, results) => {
        if (err) return next(new AppError(err.message, 500))
        if (results.length === 0) {
            return next(new AppError("NO records were found to store in csv file for the last month", 400))
        }
        // Export overdue borrows data to CSV
        const csvFilename = 'overdue_borrows_last_month.csv';
        generateCSV(results, csvFilename);
        res.status(200).json({ status: 'Success', message: "Data is returned in overdue_borrows_last_month.csv" });

    });

};
