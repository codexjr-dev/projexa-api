const router = require('express').Router();
const { signIn } = require('./AuthController');

router.post('/signIn', signIn);

module.exports = router;