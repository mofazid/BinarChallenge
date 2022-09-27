const express = require('express')
const passport = require('passport')
const jsonParser = require('body-parser').json()
const router = express.Router()
const apiController = require('../controller/api')
const Middleware = require('../utils/middleware') 


//login name:admin password:admin the role is admin
router.post('/register', jsonParser, apiController.register)
router.post('/login', jsonParser, apiController.login)
router.post('/createRoom', jsonParser, Middleware.verifyToken, apiController.createRoom)
router.post('/fight/:id', jsonParser, Middleware.verifyToken, apiController.fight)
router.get('/api/history', jsonParser, apiController.history)


module.exports = router;