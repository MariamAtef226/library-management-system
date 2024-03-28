const express = require('express');

const { getAllBorrowers, createBorrower, getBorrower, deleteBorrower, updateBorrower} = require(`${__dirname}/../controllers/borrowerController`)

let router = express.Router()

router.route('/').get(getAllBorrowers).post(createBorrower);
router.route('/:id').get(getBorrower).patch(updateBorrower).delete(deleteBorrower);


module.exports = router;