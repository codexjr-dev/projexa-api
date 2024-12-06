const router = require('express').Router();
const { sign-in } = require('./AuthController');

router.post('/sign-in', sign-in);

module.exports = router;