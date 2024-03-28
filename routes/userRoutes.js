const express = require('express');

const { signup, login, forgetPassword, resetPassword,  updatePassword, protect } = require('../controllers/authController');
const { updateMe, deleteMe } = require('../controllers/usersController');
const { getAllUsers, createUser, getUser, deleteUser, updateUser} = require(`${__dirname}/../controllers/usersController`)

let router = express.Router()

router.post('/signup', signup);
router.post('/login',login);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword',protect,updatePassword);
router.patch('/updateMe',protect, updateMe)
router.delete('/deleteMe',protect,deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


module.exports = router;