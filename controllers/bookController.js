
// Get All Books (includes search)
exports.getAllBooks = (req, res, next) => {
    const db = req.app.locals.db;

    // Assume the search case is general --> search for any book that either has title x or author x or ISBN x
    const { search } = req.query;
    // Construct the base SQL query
    let sql = 'SELECT * FROM books ';

    // If a search parameter is provided, add it to the SQL query
    if (search) {
        sql += 'WHERE title LIKE ? OR author LIKE ? OR ISBN LIKE ?';
        const values = [search, search, search];
        
        db.query(sql, values, (err, results) => {
            if (err) {
                return next(err); // Pass the error to the error-handling middleware
            }
            res.status(200).json({ status: "Success", length: results.length, results });
        });
    } else {
        db.query(sql, (err, results) => {
            if (err) {
                return next(err); // Pass the error to the error-handling middleware
            }
            res.status(200).json({ status: "Success", length: results.length, results });
        });
    }
};

// Get Book by ID
exports.getBook = (req, res, next) => {
    const db = req.app.locals.db;

    const id  = req.params.id;

    let sql = 'SELECT * FROM books WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Book not found" });
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
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query('INSERT INTO books (title, author, ISBN, quantity, location) VALUES (?, ?, ?, ?, ?)', [title, author, ISBN, quantity, location], (err, result) => {
        if (err) throw err;
        res.status(201).json({ status: "Success", result });
    });
};

// Update a Book
exports.updateBook = (req, res, next) => {
    const db = req.app.locals.db;

    const bookId = req.params.id;
    const { title, author, ISBN, quantity, location } = req.body;

    // Check if any update fields are provided
    if (!title && !author && !ISBN && !quantity && !location) {
        return res.status(400).json({ error: "At least one field is required for update" });
    }

    // Construct the SQL query for updating the book
    let sql = 'UPDATE books SET ';
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
            return next(err); // Pass the error to the error-handling middleware
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json({ status: "Success", message: "Book updated successfully" });
    });
};

// Delete a Book
exports.deleteBook = (req, res, next) => {
    const db = req.app.locals.db;

    const bookId = req.params.id;

    // Construct the SQL query for deleting the book by its ID
    const sql = 'DELETE FROM books WHERE id = ?';

    // Execute the SQL query
    db.query(sql, [bookId], (err, result) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json({ status: "Success", message: "Book deleted successfully" });
    });
};