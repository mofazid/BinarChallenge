const { hashSync, compareSync } = require("bcrypt")
const jwt  = require('jsonwebtoken')
const { users, rooms } = require('../models');
const axios = require("axios")  ;

exports.dashboard =  async function(req, res, next) {
  const data = await axios.get('http://localhost:3000/api/history')
  if(req.body.role === 'admin') {
    res.status(200).render('dashboard', {data: data.data})
  } else {
    res.status(200).render('score', {data: data.data})
  }
}
