
// Get All Borrowing Processes
exports.getBorrowingProcesses = (req, res, next) => {
    const db = req.app.locals.db;

    // Construct the base SQL query
    let sql = 'SELECT * FROM borrowing_processes ';

    db.query(sql, (err, results) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        res.status(200).json({ status: "Success", length: results.length, results });
    });

};


// borrow a book
exports.borrowABook = (req, res, next) => {
    const db = req.app.locals.db;

    // ensure they exist
    const { borrower_id, book_id, due_date } = req.body;
   // handle format from frontend (make sure it is a date)

    // Check if all required fields are present
    if (!borrower_id || !book_id || !due_date) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query('INSERT INTO borrowing_processes (borrower_id, book_id, borrowed_at, returned, due_date) VALUES (?, ?, NOW(), false, ?)', [borrower_id, book_id,due_date], (err, result) => {
        if (err) throw err;
        res.status(201).json({ status: "Success", result });
    });
};


// Get Borrowing Process by ID
exports.getBorrowingProcess = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowingProcessId  = req.params.id;

    let sql = 'SELECT * FROM borrowing_processes WHERE id = ?';

    db.query(sql, [borrowingProcessId], (err, results) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Borrowing Process not found" });
        }
        res.status(200).json({ status: "Success", result: results[0] });
    });
};

// Update a Borrowing Process
exports.returnABook = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowingProcessId = req.params.id;

    // Construct the SQL query for updating the borrower
    let sql = 'UPDATE borrowers SET returned = true WHERE id = ?';

    // Execute the SQL query
    db.query(sql, [borrowingProcessId], (err, result) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Borrowing Process not found" });
        }
        res.json({ status: "Success", message: "Borrowing Process is updated as returned successfully" });
    });
};

// Get Borrowing Process by borrower ID
exports.getUserBorrowings = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowerId  = req.params.id;

    let sql = 'SELECT * FROM borrowing_processes WHERE borrower_id = ?';

    db.query(sql, [borrowerId], (err, results) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        res.status(200).json({ status: "Success", results});
    });
};

// Get Over due borrowing processes
exports.getOverdue = (req, res, next) => {
    const db = req.app.locals.db;


    let sql = 'SELECT * FROM borrowing_processes WHERE due_date < NOW()';

    db.query(sql, (err, results) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        res.status(200).json({ status: "Success", results});
    });
};