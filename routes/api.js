const express = require('express')
const passport = require('passport')
const jsonParser = require('body-parser').json()
const router = express.Router()
const apiController = require('../controller/api')


router.post('/register', jsonParser, apiController.register)


module.exports = router;