const AppError = require("../utils/appError");
const isValidISBN10 = require("../utils/isValidIsbn");

// Get All Books (includes search)
exports.getAllBooks = (req, res, next) => {
    const db = req.app.locals.db;

    // Assume general search --> i.e. search for any book that either has title "x" or author "x" or ISBN "x"
    const { search } = req.query;

    // Construct the base SQL query
    let sql = 'SELECT * FROM books ';

    // If a search parameter is provided, add it to the SQL query
    if (search) {
        let searchValue = "%" + search + "%";
        sql += 'WHERE title LIKE ? OR author LIKE ? OR ISBN LIKE ?';
        const values = [searchValue, searchValue, searchValue];
        db.query(sql, values, (err, results) => {
            if (err) {
                return next(new AppError(err.message, 400));
            }
            res.status(200).json({ status: "Success", length: results.length, results });
        });
    } else {
        db.query(sql, (err, results) => {
            if (err) {
                return next(new AppError('Couldn\'t retrieve books data', 400));
            }
            res.status(200).json({ status: "Success", length: results.length, results });
        });
    }
};

// Get Book by ID
exports.getBook = (req, res, next) => {
    const db = req.app.locals.db;

    const bookId = Number(req.params.id);
    // make sure passed id is a number
    if (typeof bookId !== 'number' || isNaN(bookId)) {
        return next(new AppError('Book\'s ID should be a numeric value', 400));
    }

    let sql = 'SELECT * FROM books WHERE id = ?';

    db.query(sql, [bookId], (err, results) => {
        if (err) {
            return next(new AppError(err.message, 400));
        }
        if (results.length === 0) {
            return res.status(404).json({ status: "Failed", message: "Book not found" });
        }
        res.status(200).json({ status: "Success", result: results[0] });
    });
};

// Create a Book
exports.createBook = (req, res, next) => {
    const db = req.app.locals.db;

    // ensure they exist
    const { title, author, ISBN, quantity, location } = req.body;

    // Check if all required fields are present
    if (!title || !author || !ISBN || !quantity || !location) {
        return next(new AppError('Title, author, isbn, quantity and location fields are all required', 400));
    }
    // Check if ISBN format is valid (assume ISBN 10)
    if (!isValidISBN10(ISBN)) {
        return next(new AppError('Invalid ISBN format', 400));
    }
    const quantity_num = Number(quantity);
    // make sure quantity is a number
    if (typeof quantity_num !== 'number' || isNaN(quantity_num)) {
        return next(new AppError('Book\'s quantity should be a numeric value', 400));
    }

    db.query('INSERT INTO books (title, author, ISBN, quantity, location, available_quantity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?,?, NOW(), NOW())', [title, author, ISBN, quantity, location, quantity], (err, result) => {
        if (err) return next(new AppError(err.message, 500));
        // case success: return created object to user
        db.query('SELECT * FROM books WHERE id = ?', [result.insertId], (fetchErr, fetchResult) => {
            if (fetchErr) return next(new AppError(fetchErr.message, 500));
            const insertedBook = fetchResult[0];
            res.status(201).json({
                status: "Success",
                message: "Book is successfully inserted into database",
                book: insertedBook
            });
        });
    });
};

// Update a Book
exports.updateBook = (req, res, next) => {
    const db = req.app.locals.db;

    const bookId = Number(req.params.id);
    // make sure passed id is a number
    if (typeof bookId !== 'number' || isNaN(bookId)) {
        return next(new AppError('Book\'s ID should be a numeric value', 400));
    }
    const { title, author, ISBN, quantity, location } = req.body;

    // Check if any update fields are provided
    if (!title && !author && !ISBN && !quantity && !location) {
        return next(new AppError('At least one field is required for update', 400));
    }
    if (quantity) {
        const quantity_num = Number(quantity);
        if (typeof quantity_num !== 'number' || isNaN(quantity_num)) {
            return next(new AppError('Book\'s quantities should be a numeric value', 400));
        }
    }


    // Construct the SQL query for updating the book
    let sql = 'UPDATE books SET updatedAt = NOW(), ';
    const updateValues = [];
    if (title) {
        sql += 'title = ?, ';
        updateValues.push(title);
    }
    if (author) {
        sql += 'author = ?, ';
        updateValues.push(author);
    }
    if (ISBN) {
        // Check if ISBN format is valid (assume ISBN 10)
        if (!isValidISBN10(ISBN)) {
            return next(new AppError('Invalid ISBN format', 400));
        }
        sql += 'ISBN = ?, ';
        updateValues.push(ISBN);
    }
    if (quantity) {
        sql += 'quantity = ?, ';
        updateValues.push(quantity);
    }

    if (location) {
        sql += 'location = ?, ';
        updateValues.push(location);
    }

    // Remove the trailing comma and space
    sql = sql.slice(0, -2);

    // Add the condition for updating a specific book by its ID
    sql += ' WHERE id = ?';
    updateValues.push(bookId);

    // Execute the SQL query
    db.query(sql, updateValues, (err, result) => {
        if (err) {
            return next(new AppError(err.message, 500));
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "Failed", message: "Book not found" });
        }
        // Fetch the updated borrower from the database
        db.query('SELECT * FROM books WHERE id = ?', [bookId], (fetchErr, fetchResult) => {
            if (fetchErr) {
                return next(new AppError(fetchErr.message, 500));
            }
            const updatedBook = fetchResult[0]; // Assuming fetchResult is an array of rows
            res.status(200).json({ status: "Success", message: "Book updated successfully", book: updatedBook });
        });

    });
};

// Delete a Book
exports.deleteBook = (req, res, next) => {
    const db = req.app.locals.db;

    const bookId = Number(req.params.id);
    // Make sure passed id is a number
    if (typeof bookId !== 'number' || isNaN(bookId)) {
        return next(new AppError('Book\'s ID should be a numeric value', 400));
    }

    // Check if the book has associated borrowing processes
    const checkQuery = 'SELECT COUNT(*) AS count FROM borrowing_processes WHERE book_id = ?';
    db.query(checkQuery, [bookId], (checkErr, checkResult) => {
        if (checkErr) {
            return next(new AppError(checkErr.message, 500));
        }

        const borrowingCount = checkResult[0].count;
        if (borrowingCount > 0) {
            // Book has associated borrowing processes, cannot delete
            return res.status(400).json({ status: "Failed", message: "Cannot delete a book with associated borrowing processes" });
        }

        // Construct the SQL query for deleting the book by its ID
        const sql = 'DELETE FROM books WHERE id = ?';
        // Execute the SQL query
        db.query(sql, [bookId], (err, result) => {
            if (err) {
                return next(new AppError(err.message, 500));
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ status: "Failed", message: "Book not found" });
            }
            res.status(204).json({ status: "Success", message: "Book deleted successfully" });
        });
    });
};
