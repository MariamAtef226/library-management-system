const AppError = require("../utils/appError");

// Get All Borrowing Processes
exports.getBorrowingProcesses = (req, res, next) => {
    const db = req.app.locals.db;

    let sql = 'SELECT * FROM borrowing_processes ';

    db.query(sql, (err, results) => {
        if (err) {
            return next(new AppError(err.message, 400)); // Pass the error to the error-handling middleware
        }
        res.status(200).json({ status: "Success", length: results.length, results });
    });

};

// Get Borrowing Process by ID
exports.getBorrowingProcess = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowingProcessId = Number(req.params.id);
    // make sure passed id is a number
    if (typeof borrowingProcessId !== 'number' || isNaN(borrowingProcessId)) {
        return next(new AppError('Borrowing Process\'s ID should be a numeric value', 400));
    }

    let sql = 'SELECT * FROM borrowing_processes WHERE id = ?';

    db.query(sql, [borrowingProcessId], (err, results) => {
        if (err) {
            return next(new AppError(err.message, 400)); // Pass the error to the error-handling middleware
        }
        if (results.length === 0) {
            return res.status(404).json({ status: "Failed", message: "Borrowing Process not found" });
        }
        res.status(200).json({ status: "Success", result: results[0] });
    });
};

// borrow a book
exports.borrowABook = (req, res, next) => {
    const db = req.app.locals.db;

    // ensure they exist
    let { borrower_id, book_id, due_date } = req.body;
    // handle format from frontend (make sure it is a date)

    if (!borrower_id || !book_id || !due_date) {
        return next(new AppError('Borrower\'s id, book\'s id and due date fields are all required', 400));
    }

    // make sure passed ids are numbers
    let borrowerId = Number(borrower_id);
    if (typeof borrowerId !== 'number' || isNaN(borrowerId)) {
        return next(new AppError('Borrower\'s ID should be a numeric value', 400));
    }

    let bookId = Number(book_id);
    if (typeof bookId !== 'number' || isNaN(bookId)) {
        return next(new AppError('Book\'s ID should be a numeric value', 400));
    }

    // Check correct date format:
    const dateObject = new Date(due_date);

    // Check if the parsed date object is valid
    if (isNaN(dateObject.getTime())) {
        return next(new AppError('Invalid due date format', 400));
    }

    // Convert the valid date object to a mysql timestamp (in milliseconds)
    const timestamp = dateObject.toISOString().replace('T', ' ').slice(0, 19);

    // check if book has available quanity > 0
    db.query('SELECT * FROM books WHERE id = ?', [book_id], (checkBookErr, checkBookResult) => {
        if (checkBookErr) return next(new AppError(checkBookErr.message, 500));
        const book = checkBookResult[0];
        if (book.available_quantity <= 0) {
            return next(new AppError("Book has no available version to be borrowed", 400));
        }
        // if available for borrowing
        db.query('INSERT INTO borrowing_processes (borrower_id, book_id, borrowed_at, returned, due_date) VALUES (?, ?, NOW(), false, ?)', [borrower_id, book_id, timestamp], (err, result) => {
            if (err) return next(new AppError(err.message, 500));
            // decreement available quantity of book
            db.query("UPDATE books set available_quantity = " + (book.available_quantity - 1) + " WHERE id=" + book.id, (decBookErr, decBookResult) => {
                if (decBookErr) return next(new AppError(decBookErr.message, 500));
                res.status(201).json({
                    status: "Success",
                    message: "Book  " + book.title + " is successfully borrowed by Borrower of ID: " + borrower_id

                });

            })

        });

    });

};


// Update a Borrowing Process
exports.returnABook = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowingProcessId = Number(req.params.id);
    // make sure passed id is a number
    if (typeof borrowingProcessId !== 'number' || isNaN(borrowingProcessId)) {
        return next(new AppError('Borrowing Process\'s ID should be a numeric value', 400));
    }
    // Construct the SQL query for updating the borrower
    let sql = 'UPDATE borrowing_processes SET returned = true WHERE id = ? AND returned = false';

    // Execute the SQL query
    db.query(sql, [borrowingProcessId], (err, result) => {
        if (err) {
            return next(new AppError(err.message, 500)); // Pass the error to the error-handling middleware
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "Failed", message: "Borrowing Process is either not found or already returned" });
        }
        db.query('SELECT book_id FROM borrowing_processes WHERE id = ?', [borrowingProcessId], (bookFromBorrowErr, bookFromBorrowResult) => {
            if (bookFromBorrowErr) {
                return next(new AppError(bookFromBorrowErr.message, 500)); // Pass the error to the error-handling middleware
            }
            let book_id = bookFromBorrowResult[0].book_id;
            db.query('UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?', [book_id], (updateErr, updateResult) => {
                if (updateErr) {
                    return next(new AppError(updateErr.message, 500)); // Pass the error to the error-handling middleware
                }
                res.status(200).json({ status: "Success", message: `Borrowing Process ${borrowingProcessId} is updated as returned successfully` });
            });

        })
    });
};

// Get Borrowing Process by borrower ID
exports.getUserBorrowings = (req, res, next) => {
    const db = req.app.locals.db;

    let borrowerId = Number(req.params.id);
    if (typeof borrowerId !== 'number' || isNaN(borrowerId)) {
        return next(new AppError('Borrower\'s ID should be a numeric value', 400));
    }

    let sql = 'SELECT * FROM borrowing_processes WHERE borrower_id = ?';

    db.query(sql, [borrowerId], (err, results) => {
        if (err) {
            return next(new AppError(err.message, 500));// Pass the error to the error-handling middleware
        }
        res.status(200).json({ status: "Success", length: results.length, results });
    });
};

// Get Over due borrowing processes
exports.getOverdue = (req, res, next) => {
    const db = req.app.locals.db;

    let sql = 'SELECT * FROM borrowing_processes WHERE due_date < NOW()';

    db.query(sql, (err, results) => {
        if (err) {
            return next(new AppError(err.message, 500)); // Pass the error to the error-handling middleware
        }
        res.status(200).json({ status: "Success", length: results.length, results });
    });
};