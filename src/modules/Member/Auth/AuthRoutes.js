const router = require('express').Router();
const { signIn } = require('./AuthController');

router.post('/sign-in', signIn);

module.exports = router;