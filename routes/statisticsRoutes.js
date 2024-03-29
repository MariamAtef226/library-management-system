const express = require('express');
const router = express.Router();
const { protect } = require(`${__dirname}/../controllers/authController`);
const { getBorrowingProcessReport, exportOverdueBorrowsLastMonth, exportBorrowingProcessesLastMonth } = require(`${__dirname}/../controllers/statisticsController`);

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: API endpoints for statistics related to library borrowing processes
 */

/**
 * @swagger
 * /api/v1/statistics/report:
 *   get:
 *     summary: Get borrowing process report
 *     description: Retrieve a report of borrowing processes within a specific period and export data in CSV format
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: Start date of the period (YYYY-MM-DD format)
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: End date of the period (YYYY-MM-DD format)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with the borrowing process report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: Message indicating the result of the operation
 *       '400':
 *         description: Bad request, missing required query parameters
 *       '500':
 *         description: Internal server error
 */
router.route('/report').get(getBorrowingProcessReport);

/**
 * @swagger
 * /api/v1/statistics/lastMonthOverdueBorrows:
 *   get:
 *     summary: Export overdue borrows from last month
 *     description: Export a report of overdue borrows from the last month in CSV format
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the exported data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       '500':
 *         description: Internal server error
 */
router.route('/lastMonthOverdueBorrows').get( exportOverdueBorrowsLastMonth);

/**
 * @swagger
 * /api/v1/statistics/lastMonthBorrowingProcesses:
 *   get:
 *     summary: Export borrowing processes from last month
 *     description: Export a report of borrowing processes from the last month in CSV format
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the exported data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       '500':
 *         description: Internal server error
 */
router.route('/lastMonthBorrowingProcesses').get( exportBorrowingProcessesLastMonth);

module.exports = router;
