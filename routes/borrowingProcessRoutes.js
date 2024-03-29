const express = require('express');
const router = express.Router();
const { protect } = require(`${__dirname}/../controllers/authController`);
const { getBorrowingProcesses, borrowABook, getBorrowingProcess, returnABook, getUserBorrowings, getOverdue } = require(`${__dirname}/../controllers/borrowingProcessController`);

/**
 * @swagger
 * tags:
 *   name: Borrowing Processes
 *   description: API endpoints for managing borrowing processes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowingProcess:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         borrower_id:
 *           type: integer
 *         borrowed_at:
 *           type: string
 *           format: date-time
 *         returned:
 *           type: boolean
 *         due_date:
 *           type: string
 *           format: date-time
 *     BorrowingInput:
 *       type: object
 *       properties:
 *         borrower_id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         due_date:
 *           type: string
 *           format: date-time
 *       required:
 *         - borrower_id
 *         - book_id
 *         - due_date
 */

/**
 * @swagger
 * /api/v1/borrowingProcesses:
 *   get:
 *     summary: Get all borrowing processes
 *     description: Retrieve a list of all borrowing processes
 *     tags: [Borrowing Processes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the list of borrowing processes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowingProcess'
 *       '500':
 *         description: Internal server error
 *   post:
 *     summary: Borrow a book
 *     description: Borrow a book and create a borrowing process
 *     tags: [Borrowing Processes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowingInput'
 *     responses:
 *       '201':
 *         description: Borrowing process created successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '404':
 *         description: Book not found or borrower not found
 *       '500':
 *         description: Internal server error
 */
router.route('/')
    .get(protect, getBorrowingProcesses)
    .post(protect, borrowABook);

/**
 * @swagger
 * /api/v1/borrowingProcesses/{id}:
 *   get:
 *     summary: Get a borrowing process by ID
 *     description: Retrieve a specific borrowing process by its ID
 *     tags: [Borrowing Processes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the borrowing process to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A successful response with the borrowing process details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowingProcess'
 *       '404':
 *         description: Borrowing process not found
 *       '500':
 *         description: Internal server error
 *   patch:
 *     summary: Return a book
 *     description: Return a book and update the borrowing process
 *     tags: [Borrowing Processes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the borrowing process to update
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Borrowing process updated successfully
 *       '404':
 *         description: Borrowing process not found
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */
router.route('/:id')
    .patch(protect, returnABook);

/**
 * @swagger
 * /api/v1/borrowingProcesses/users/{id}:
 *   get:
 *     summary: Get borrowing processes for a user
 *     description: Retrieve a list of borrowing processes for a specific user
 *     tags: [Borrowing Processes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve borrowing processes for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A successful response with the list of borrowing processes for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowingProcess'
 *       '404':
 *         description: User not found or no borrowing processes found for the user
 *       '500':
 *         description: Internal server error
 */
router.route('/users/:id')
    .get(protect, getUserBorrowings);

/**
 * @swagger
 * /api/v1/borrowingProcesses/overdue:
 *   get:
 *     summary: Get overdue borrowing processes
 *     description: Retrieve a list of overdue borrowing processes
 *     tags: [Borrowing Processes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the list of overdue borrowing processes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowingProcess'
 *       '500':
 *         description: Internal server error
 */
router.route('/overdue')
    .get(protect, getOverdue);

module.exports = router;
