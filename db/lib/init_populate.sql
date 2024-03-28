create database IF NOT EXISTS library_management;
-- Create 'books' table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    author VARCHAR(255) NOT NULL,
    ISBN VARCHAR(255) NOT NULL UNIQUE,
    quantity INT NOT NULL CHECK (quantity >= 1),
    location VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Create 'borrowers' table
CREATE TABLE IF NOT EXISTS borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create 'borrowing_processes' table
CREATE TABLE IF NOT EXISTS borrowing_processes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    borrower_id INT,
    borrowed_at DATETIME,
    returned BOOLEAN,
    due_date DATETIME NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id)
);

-- Insert data into 'books' table
INSERT INTO books (title, author, ISBN, quantity, location, createdAt, updatedAt)
VALUES
    ('Book 1', 'Author 1', '1234567890', 5, 'Location 1', NOW(), NOW()),
    ('Book 2', 'Author 2', '0987654321', 10, 'Location 2', NOW(), NOW()),
    ('Book 3', 'Author 3', '9876543210', 7, 'Location 3', NOW(), NOW());

-- Insert data into 'borrowers' table
INSERT INTO borrowers (name, email, reg_date)
VALUES
    ('Borrower 1', 'borrower1@example.com', NOW()),
    ('Borrower 2', 'borrower2@example.com', NOW()),
    ('Borrower 3', 'borrower3@example.com', NOW());

-- Insert data into 'borrowing_processes' table
INSERT INTO borrowing_processes (book_id, borrower_id, borrowed_at, returned, due_date)
VALUES
    (1, 1, NOW(), false, DATE_ADD(NOW(), INTERVAL 30 DAY)),
    (2, 2, NOW(), true, DATE_ADD(NOW(), INTERVAL 15 DAY)),
    (3, 3, NOW(), false, DATE_ADD(NOW(), INTERVAL 20 DAY));