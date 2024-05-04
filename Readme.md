# 📚 Library Management System 📚

Library Management System is a simple Node.js-based server-side application that supports basic CRUD of major library entities, such as books and borrowers. This system also allows users to manage the borrowing process, track overdue books, and generate analytical reports. The system is built using a RESTful API architecture and utilizes a relational database system for data storage.

## Key Features 🔑

- Show analytical reports of the borrowing process 💻
- Search and listing system for books and borrowers 🔎
- Borrowing process management with due date tracking 📅
- Updates on book availability and borrowing status 🕒

## System Design 🛠️

> The schema diagram provides a visual representation of the relationships between the various entities, such as books, borrowers, and borrowing processes, in the system. It provide a comprehensive overview of the system architecture and data flow, ensuring a well-designed and efficient library management system.

<p align="center" width="100%">
<img src="docs/data_docs/schema.png">
</p>
<p align="center" width="100%">
Schema
</p>

### API Endpoints 🔌

API Documentation is found at : localhost:3000/api-docs


### ASSUMPTIONS:

- Available_quantity shouldn't be altered (derived only from processes of borrowing)
- Borrowers are lent books through librarians (admins) who register their borrowing process on the system - borrowers don't have access to our system
- all workers are have accounts on our system ( have entry in table admins)
- No feature can be accessed unless user is logged in


### Pre-requisites :screwdriver:

- Docker (Windows/Mac/Linux) for containerization 🐳

### Run :green_circle:

- Clone the repository to your local machine 💻⬇️
- Notice the env file and check env variables for correctness 📝
- Run command: `docker compose up -d `📦
- You will have 2 containers running one with database (with the schema in db/lib already created) and the other is the application itself
- Access the application at http://localhost:3000 with api calls in your browser. 🌐

### Licensing 📝

This code is licensed under the GNU License  .[![GNU License](https://img.shields.io/badge/license-GNU-blue.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0.html)

### Authors 🖊

- [Marwan Ahmed](https://github.com/XMaroRadoX)
