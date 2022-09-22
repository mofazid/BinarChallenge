var express = require('express');
var router = express.Router();
const { users } = require('../models');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
