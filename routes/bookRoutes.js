const express = require('express');
const router = express.Router();

// Import controller functions
const { getAllBooks, createBook, getBook, deleteBook, updateBook } = require(`${__dirname}/../controllers/bookController`);
const { protect } = require(`${__dirname}/../controllers/authController`);

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API endpoints for managing books in the library
 */

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of all books in the library
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       '500':
 *         description: Internal server error
 *   post:
 *     summary: Create a new book
 *     description: Add a new book to the library
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       '201':
 *         description: Book created successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieve a specific book by its ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A successful response with the book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 *   patch:
 *     summary: Update a book by ID
 *     description: Update the details of a specific book by its ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       '200':
 *         description: Book updated successfully
 *       '404':
 *         description: Book not found
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 *   delete:
 *     summary: Delete a book by ID
 *     description: Remove a specific book from the library by its ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Book deleted successfully
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         ISBN:
 *           type: string
 *         quantity:
 *           type: integer
 *         available_quantity:
 *           type: integer
 *         location:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BookInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         ISBN:
 *           type: string
 *         quantity:
 *           type: integer
 *         available_quantity:
 *           type: integer
 *         location:
 *           type: string
 *       required:
 *         - title
 *         - author
 *         - ISBN
 *         - quantity
 *         - available_quantity
 *         - location
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.route('/')
    .get(protect, getAllBooks)
    .post(protect, createBook);

router.route('/:id')
    .get(protect, getBook)
    .patch(protect, updateBook)
    .delete(protect, deleteBook);

module.exports = router;
