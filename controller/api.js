const { hashSync, compareSync } = require("bcrypt")
const jwt  = require('jsonwebtoken')
const { users } = require('../models');


exports.register = async function(req, res, next) {
  try {
    if(req.body.role !== 'admin' && req.body.role !== 'player') {
      res.status(400).json({message: 'Role must be admin or player'})
    } else {
      const user = await users.create({
        name: req.body.name,
        password: req.body.password,
        role: req.body.role
      })
      res.status(201).send(user);
    }


  } catch (error) {
    res.status(400).send("UNABLE TO INSERT DATA")
  }
};

