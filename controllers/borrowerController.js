
// Get All Borrowers
exports.getAllBorrowers = (req, res, next) => {
    // Construct the base SQL query
    let sql = 'SELECT * FROM borrowers ';
    const db = req.app.locals.db;

    db.query(sql, (err, results) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        res.status(200).json({ status: "Success", length: results.length, results });
    });

};

// Get Borrower by ID
exports.getBorrower = (req, res, next) => {
    const borrowerId  = req.params.id;
    const db = req.app.locals.db;

    let sql = 'SELECT * FROM borrowers WHERE id = ?';

    db.query(sql, [borrowerId], (err, results) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Borrower not found" });
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
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query('INSERT INTO borrowers (name, email, reg_date) VALUES (?, ?, NOW())', [name, email], (err, result) => {
        if (err) throw err;
        res.status(201).json({ status: "Success", result });
    });
};

// Update a Borrower
exports.updateBorrower = (req, res, next) => {
    const db = req.app.locals.db;

    const borrowerId = req.params.id;
    const { name, email } = req.body;

    // Check if any update fields are provided
    if (!name && !email) {
        return res.status(400).json({ error: "At least one field is required for update" });
    }

    // Construct the SQL query for updating the borrower
    let sql = 'UPDATE borrowers SET ';
    const updateValues = [];
    if (title) {
        sql += 'name = ?, ';
        updateValues.push(name);
    }
    if (author) {
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
            return next(err); // Pass the error to the error-handling middleware
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Borrower not found" });
        }
        res.json({ status: "Success", message: "Borrower updated successfully" });
    });
};

// Delete a Borrower
exports.deleteBorrower = (req, res, next) => {
    const borrowerId = req.params.id;
    const db = req.app.locals.db;


    // Construct the SQL query for deleting the borrower by its ID
    const sql = 'DELETE FROM borrowers WHERE id = ?';

    // Execute the SQL query
    db.query(sql, [borrowerId], (err, result) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Borrower not found" });
        }
        res.json({ status: "Success", message: "Borrower deleted successfully" });
    });
};