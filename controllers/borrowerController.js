const AppError = require("../utils/appError");

// Get All Borrowers
exports.getAllBorrowers = (req, res, next) => {
    const db = req.app.locals.db;

    let sql = 'SELECT * FROM borrowers ';

    db.query(sql, (err, results) => {
        if (err) {
            return next(new AppError(err.message, 400));
        }
        res.status(200).json({ status: "Success", length: results.length, results });
    });

};

// Get Borrower by ID
exports.getBorrower = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowerId = Number(req.params.id);
    // make sure passed id is a number
    if (typeof borrowerId !== 'number' || isNaN(borrowerId)) {
        return next(new AppError('Borrower\'s ID should be a numeric value', 400));
    }

    let sql = 'SELECT * FROM borrowers WHERE id = ?';

    db.query(sql, [borrowerId], (err, results) => {
        if (err) {
            return next(new AppError(err.message, 400));
        }
        if (results.length === 0) {
            return res.status(404).json({ status: "Failed", message: "Borrower not found" });
        }
        res.status(200).json({ status: "Success", result: results[0] });
    });
};

// Create a Borrower
exports.createBorrower = (req, res, next) => {
    // ensure they exist
    const { name, email } = req.body;
    const db = req.app.locals.db;

    // Check if all required fields are present
    if (!name || !email) {
        return next(new AppError('Name and Email fields are all required', 400));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new AppError('Invalid email format', 400));
    }

    db.query('INSERT INTO borrowers (name, email, reg_date) VALUES (?, ?, NOW())', [name, email], (err, result) => {
        if (err) return next(new AppError(err.message, 500));
        // Fetch the newly inserted borrower from the database
        db.query('SELECT * FROM borrowers WHERE id = ?', [result.insertId], (fetchErr, fetchResult) => {
            if (fetchErr) return next(new AppError(fetchErr.message, 500));

            const insertedBorrower = fetchResult[0]; // Assuming fetchResult is an array of rows
            res.status(201).json({
                status: "Success",
                message: "Borrower is successfully inserted into database",
                borrower: insertedBorrower
            });
        });
    });
};

// Update a Borrower
exports.updateBorrower = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowerId = Number(req.params.id);
    // make sure passed id is a number
    if (typeof borrowerId !== 'number' || isNaN(borrowerId)) {
        return next(new AppError('Borrower\'s ID should be a numeric value', 400));
    }

    const { name, email } = req.body;

    // Check if any update fields are provided
    if (!name && !email) {
        return next(new AppError("At least one field is required for update", 400));
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return next(new AppError('Invalid email format', 400));
    }

    // Construct the SQL query for updating the borrower
    let sql = 'UPDATE borrowers SET ';
    const updateValues = [];
    if (name) {
        sql += 'name = ?, ';
        updateValues.push(name);
    }
    if (email) {
        sql += 'email = ?, ';
        updateValues.push(email);
    }
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);

    // Add the condition for updating a specific borrower by its ID
    sql += ' WHERE id = ?';
    updateValues.push(borrowerId);

    // Execute the SQL query
    db.query(sql, updateValues, (err, result) => {
        if (err) {
            return next(new AppError(err.message, 500));
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "Failed", message: "Borrower not found" })
        }
        // Fetch the updated borrower from the database
        db.query('SELECT * FROM borrowers WHERE id = ?', [borrowerId], (fetchErr, fetchResult) => {
            if (fetchErr) {
                return next(new AppError(fetchErr.message, 500));
            }

            const updatedBorrower = fetchResult[0]; // Assuming fetchResult is an array of rows
            res.status(200).json({ status: "Success", message: "Borrower updated successfully", borrower: updatedBorrower });
        });
    });
};

// Delete a Borrower
exports.deleteBorrower = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowerId = Number(req.params.id);
    // make sure passed id is a number
    if (typeof borrowerId !== 'number' || isNaN(borrowerId)) {
        return next(new AppError('Borrower\'s ID should be a numeric value', 400));
    }

    // Construct the SQL query for deleting the borrower by its ID
    const sql = 'DELETE FROM borrowers WHERE id = ?';

    // Execute the SQL query
    db.query(sql, [borrowerId], (err, result) => {
        if (err) {
            // Check if the error message indicates a foreign key constraint failure
            if (err.message.includes('foreign key constraint fails')) {
                return next(new AppError('Cannot delete borrower: related records exist in borrowing processes', 400));
            }
            // For other errors, pass the error to the error-handling middleware
            return next(new AppError(err.message, 500));
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "fail", message: "Borrower not found" });
        }
        res.status(204).json({ status: "success", message: "Borrower deleted successfully" });
    });
};
