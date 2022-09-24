const express = require('express')
const passport = require('passport')
const jsonParser = require('body-parser').json()
const router = express.Router()
const apiController = require('../controller/api')


router.post('/register', jsonParser, apiController.register)
router.post('/login', jsonParser, apiController.login)
router.post('/createRoom', jsonParser, apiController.createRoom)
router.post('/fight/:id', jsonParser, apiController.fight)



module.exports = router;