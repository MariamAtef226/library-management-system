# 📚 Library Management System 📚

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/XMaroRadoX/library-managment-backend)
Bosta Library Management System is a Node.js-based application designed to help manage books and borrowers in a library setting. This system allows users to perform CRUD operations on books and borrowers, manage the borrowing process, track overdue books, and generate analytical reports. The system is built using a RESTful API architecture and utilizes a relational database system for data storage.

## Key Features 🔑

- User-friendly interface for library management 💻
- Admin panel for managing books, borrowers, and borrowing processes 🚀
- Search and listing system for books and borrowers 🔎
- Borrowing process management with due date tracking 📅
- Updates on book availability and borrowing status 🕒

Feel free to customize the content further based on your project specifics and preferences.

## System Design 🛠️

> The schema diagram provides a visual representation of the relationships between the various entities, such as books, borrowers, and borrowing processes, in the system. It provide a comprehensive overview of the system architecture and data flow, ensuring a well-designed and efficient library management system.

 <p align="center" width="100%">
<img src="docs/data_docs/schema.png">
</p>
<p align="center" width="100%">
Schema
</p>

### API Endpoints 🔌

Books

- GET /api/books - List all books
- GET /api/books/:id - Get a specific book
- POST /api/books - Add a new book
- PUT /api/books/:id - Update a book
- DELETE /api/books/:id - Delete a book

Borrowers

- GET /api/borrowers - List all borrowers
- GET /api/borrowers/:id - Get a specific borrower
- POST /api/borrowers - Add a new borrower
- PUT /api/borrowers/:id - Update a borrower
- DELETE /api/borrowers/:id - Delete a borrower

Borrowing Process

- GET /api/borrowing - List all borrowing processes
- POST /api/borrowing/checkout - Checkout a book
- POST /api/borrowing/return - Return a book
- GET /api/borrowing/overdue - List overdue books

## Table of contents 🏷

| File Name                                                                                      | Description                                                               |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Routes](https://github.com/XMaroRadoX/library-managment-backend/tree/main/routes)             | Contains Source code of the project                                       |
| [db](https://github.com/XMaroRadoX/library-managment-backend/tree/main/db/lib)                 | Contians database configuration and sample data                           |
| [package.json](https://github.com/XMaroRadoX/library-managment-backend/blob/main/package.json) | contains the metadata information about the project and its dependencies. |

### Pre-requisites :screwdriver:

- Docker (Windows/Mac/Linux) for containerization 🐳

### Run :green_circle:

- Clone the repository to your local machine 💻⬇️
- Notice the env file and check env variables for correctness 📝
- Run command: `docker compose up -d `📦
- You will have 2 containers running one with database (with the schema in db/lib already created) and the other is the application itself
- Access the application at http://localhost:3000 with api calls in your browser. 🌐

### Licensing 📝

This code is licensed under the GNU License.

### Authors 🖊

- [Marwan Radwan](https://github.com/XMaroRadoX)

### Contribution 🥂

Feel free to contribute just make a pull request and do what you wish. 😼

[![GNU License](https://img.shields.io/badge/license-GNU-blue.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0.html)