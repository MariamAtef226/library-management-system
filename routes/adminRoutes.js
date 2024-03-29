const express = require('express');
const router = express.Router();

// Import controller functions
const { login, signup } = require(`${__dirname}/../controllers/authController`);

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: API endpoints for managing admin accounts
 */

/**
 * @swagger
 * /api/v1/admins/signup:
 *   post:
 *     summary: Create a new admin account
 *     description: Register a new admin account
 *     tags: [Admins]
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
 *               password:
 *                 type: string
 *                 format: password
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: Admin account created successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */
router.route('/signup')
    .post(signup);

/**
 * @swagger
 * /api/v1/admins/login:
 *   post:
 *     summary: Log in as an admin
 *     description: Log in with admin credentials
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Admin logged in successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '401':
 *         description: Unauthorized, incorrect email or password
 *       '500':
 *         description: Internal server error
 */
router.route('/login')
    .post(login);

module.exports = router;
