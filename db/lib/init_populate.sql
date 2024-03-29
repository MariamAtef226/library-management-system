drop database library_management;

create database library_management;

use  library_management;

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    author VARCHAR(255) NOT NULL,
    ISBN VARCHAR(255) NOT NULL UNIQUE,
    quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);


INSERT INTO books (title, author, ISBN, quantity, location, available_quantity, createdAt, updatedAt)
VALUES
    ('Book 1', 'Author 1', '1234567890', 5, 'Location 1', 2, NOW(), NOW()),
    ('Book 2', 'Author 2', '0987654321', 10, 'Location 2', 9, NOW(), NOW()),
    ('Book 3', 'Author 3', '9876543210', 7, 'Location 3', 7, NOW(), NOW());

INSERT INTO borrowers (name, email, reg_date)
VALUES
    ('Borrower 1', 'borrower1@example.com', NOW()),
    ('Borrower 2', 'borrower2@example.com', NOW()),
    ('Borrower 3', 'borrower3@example.com', NOW());

INSERT INTO borrowing_processes (book_id, borrower_id, borrowed_at, returned, due_date)
VALUES
    (1, 1, NOW(), false, DATE_ADD(NOW(), INTERVAL 30 DAY)),
    (2, 2, NOW(), true, DATE_ADD(NOW(), INTERVAL 15 DAY)),
    (3, 3, NOW(), false, DATE_ADD(NOW(), INTERVAL 20 DAY));


INSERT INTO admins (name, email, password)
VALUES
    ('Admin', 'admin@mail.com', '$2a$12$Z1163MRGVKkTEq8OsQpUQOGViEGZXL7ChX3yvFFZKWamtZkueo5qu'); -- Password is 12345678
