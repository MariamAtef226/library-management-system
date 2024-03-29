const express = require('express');
const router = express.Router();

// Import controller functions
const { getAllBorrowers, createBorrower, getBorrower, deleteBorrower, updateBorrower } = require(`${__dirname}/../controllers/borrowerController`);
const { protect } = require(`${__dirname}/../controllers/authController`);

/**
 * @swagger
 * tags:
 *   name: Borrowers
 *   description: API endpoints for managing borrowers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Borrower:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/borrowers:
 *   get:
 *     summary: Get all borrowers
 *     description: Retrieve a list of all borrowers
 *     tags: [Borrowers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the list of borrowers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Borrower'
 *       '500':
 *         description: Internal server error
 *   post:
 *     summary: Create a new borrower
 *     description: Add a new borrower
 *     tags: [Borrowers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       '201':
 *         description: Borrower created successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */
router.route('/')
    .get(protect, getAllBorrowers)
    .post(protect, createBorrower);

/**
 * @swagger
 * /api/v1/borrowers/{id}:
 *   get:
 *     summary: Get a borrower by ID
 *     description: Retrieve a specific borrower by ID
 *     tags: [Borrowers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the borrower to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A successful response with the borrower details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrower'
 *       '404':
 *         description: Borrower not found
 *       '500':
 *         description: Internal server error
 *   patch:
 *     summary: Update a borrower by ID
 *     description: Update the details of a specific borrower by ID
 *     tags: [Borrowers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the borrower to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       '200':
 *         description: Borrower updated successfully
 *       '404':
 *         description: Borrower not found
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 *   delete:
 *     summary: Delete a borrower by ID
 *     description: Remove a specific borrower by ID
 *     tags: [Borrowers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the borrower to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Borrower deleted successfully
 *       '404':
 *         description: Borrower not found
 *       '500':
 *         description: Internal server error
 */
router.route('/:id')
    .get(protect, getBorrower)
    .patch(protect, updateBorrower)
    .delete(protect, deleteBorrower);

module.exports = router;
