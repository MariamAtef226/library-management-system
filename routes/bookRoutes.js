const express = require('express');

const { getAllBooks, createBook, getBook, deleteBook, updateBook} = require(`${__dirname}/../controllers/bookController`)

let router = express.Router()

// search by title, author or isbn is handled inside get (filtering and search)
router.route('/').get(getAllBooks).post(createBook);
router.route('/:id').get(getBook).patch(updateBook).delete(deleteBook);


module.exports = router;