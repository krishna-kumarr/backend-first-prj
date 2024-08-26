const express = require('express');
const { registerUser, loginUser, logOutUser, forgotPassword, resetPassword } = require("../controllers/authController");
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logOutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);


module.exports = router;