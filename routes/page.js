const express = require('express')
const passport = require('passport')
const jsonParser = require('body-parser').json()
const router = express.Router()
const apiController = require('../controller/api')
const Middleware = require('../utils/middleware')
const pageController = require('../controller/page')


// router.get('/dashboard' ,passport.authenticate( 'secret', {session: false }), Middleware.validateAdmin, pageController.dashboard) 

router.get('/dashboard' ,Middleware.verifyToken, Middleware.validateAdmin, pageController.dashboard)


module.exports = router;