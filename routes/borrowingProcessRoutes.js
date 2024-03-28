const express = require('express');

const { getBorrowingProcesses, borrowABook, getBorrowingProcess, returnABook, getUserBorrowings, getOverdue} = require(`${__dirname}/../controllers/borrowingProcessController`)

let router = express.Router()

router.route('/').get(getBorrowingProcesses).post(borrowABook);
router.route('/:id').get(getBorrowingProcess).patch(returnABook);
router.route('/users/:id').get(getUserBorrowings);
router.route('/overdue').get(getOverdue);


module.exports = router;