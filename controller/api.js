const { hashSync, compareSync } = require("bcrypt")
const jwt  = require('jsonwebtoken')
const { users, rooms } = require('../models');
const axios = require("axios")  ;


exports.register = async function(req, res, next) {
  try {
    if(req.body.role !== 'admin' && req.body.role !== 'player') {
      res.status(400).json({message: 'Role must be admin or player'})
    } else {
      const user = await users.create({
        name: req.body.name,
        password:hashSync(req.body.password, 10),
        role: req.body.role
      })
      res.status(201).send({
        message: 'User created successfully',
        user: {
          id: user.id,
          username: user.name,
          role: user.role
        }
     });
    }
  } catch (error) {
    res.status(400).send("Unable to insert data or name cannot be duplicated")
  }
};

exports.login = async function(req, res, next) {
  try {
    const user = await users.findOne({
      where: {
        name: req.body.name
      }
    })
    if(user) {
      const isPasswordValid = compareSync(req.body.password, user.password)
      if(isPasswordValid) {
        const token = jwt.sign({ id: user.id, role: user.role }, 'secret', { expiresIn: "2h" })
        res.status(200).send({ auth: true, token: token, })
      } else {
        res.status(401).send({ auth: false, token: null })
      }
    } else {
      res.status(404).send({ auth: false, token: null })
    }
  } catch (error) {
    res.status(400).send("wrong password or username")
  }
}

exports.createRoom = async function(req, res, next) {
  try{
    const room = await rooms.create({
      name: req.body.name,
    })
    res.status(201).send({
      message: 'Room created successfully',
      room: {
        id: room.id,
        name: room.name
      }
   });
  }
  catch(error){
    res.status(400).send("something went wrong")
  }
}


exports.fight = async function(req, res, next) {
  try {
    const batu = 'batu'
    const gunting = 'gunting'
    const kertas = 'kertas'

 

    const room = await rooms.findOne({
      where: {
        id: req.params.id
      }
    })

    room.update({
      player1choice: req.body.p1,
      player2choice: req.body.p2,
      })

      p1Choice = []
      p2Choice = []
      
      if(room.player1choice === room.player2choice){
        room.update({
          winner: 'draw'
        })

      } 
      else if(room.player1choice === batu && room.player2choice === gunting || room.player1choice === gunting && room.player2choice === kertas || room.player1choice === kertas && room.player2choice === batu){
        room.update({
          winner: 'player1'
        })
        p1Choice.push(req.body.p1)
        p2Choice.push(req.body.p2)
        console.log(p1Choice, p2Choice)
      }
      else if(room.player2choice === batu && room.player1choice === gunting || room.player2choice === gunting && room.player1choice === kertas || room.player2choice === kertas && room.player1choice === batu){
        room.update({
          winner: 'player2'
        })
        p1Choice.push(req.body.p1)
        p2Choice.push(req.body.p2)
        console.log(p1Choice, p2Choice)
      }
      else{
        room.update({
          winner: 'draw'
        })
      }
      res.status(200).send({
        message: 'game ended',
        room: {
          id: room.id,
          name: room.name,
          player1choice: room.player1choice,
          player2choice: room.player2choice,
          winner: room.winner
        }
      });
  } catch (error) {
    res.status(400).send("something went wrong")
  }
}


exports.history =  async function(req, res, next) {
  try{
    rooms.findAll({
    }).then(rooms => {
      res.status(200).send(rooms)
    })
  }
  catch(error){
    res.status(400).send("something went wrong")
  }
}