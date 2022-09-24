const { hashSync, compareSync } = require("bcrypt")
const jwt  = require('jsonwebtoken')
const { users, rooms } = require('../models');


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
        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 86400 })
        res.status(200).send({ auth: true, token: token })
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
      player1choice: req.body.player1Choice,
      player2choice: req.body.player2Choice,
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
    if(room) {
      if(req.body.choice === batu || req.body.choice === gunting || req.body.choice === kertas) {
        if(room.player1Choice === null) {
          await rooms.update({
            player1Choice: req.body.choice
          }, {
            where: {
              id: req.params.id
            }
          })
          res.status(200).send({ message: 'Waiting for player 2'})
        } else if(room.player2Choice === null) {
          await rooms.update({
            player2Choice: req.body.choice
          }, {
            where: {
              id: req.params.id
            }
          })
          if(room.player1Choice === batu && room.player2Choice === gunting) {
            await rooms.update({
              winner: 'player1'
            }, {
              where: {
                id: req.params.id
              }
            })
            res.status(200).send({ message: 'Player 1 win'})
          } else if(room.player1Choice === batu && room.player2Choice === kertas) {
            await rooms.update({
              winner: 'player2'
            }, {
              where: {
                id: req.params.id
              }
            })
            res.status(200).send({ message: 'Player 2 win'})
          } else if(room.player1Choice === gunting && room.player2Choice === batu) {
            await rooms.update({
              winner: 'player2'
            }, {
              where: {
                id: req.params.id
              }
            })
            res.status(200).send({ message: 'Player 2 win'})
          } else if(room.player1Choice === gunting && room.player2Choice === kertas) {
            await rooms.update({
              winner: 'player1'
            }, {
              where: {
                id: req.params.id
              }
            })
            res.status(200).send({ message: 'Player 1 win'})
          } else if(room.player1Choice === kertas && room.player2Choice === batu) {
            await rooms.update({
              winner: 'player1'
            }, {
              where: {
                id: req.params.id
              }
            })
            res.status(200).send({ message: 'Player 1 win'})
          } else if(room.player1Choice === kertas && room.player2Choice === gunting) {
            await rooms.update({
              winner: 'player2'
            }, {
              where: {
                id: req.params.id
              }
            })
            res.status(200).send({ message: 'Player 2 win'})
          } else {
            await rooms.update({
              winner: 'draw'
            }, {
              where: {
                id: req.params.id
              }
            })
            res.status(200).send({ message: 'Draw'})
          }
        } else {
          res.status(400).send({ message: 'Room is full'})
        }
      } else {
        res.status(400).send({ message: 'Choice must be batu, gunting or kertas'})
      }
    } else {
      res.status(404).send({ message: 'Room not found'})
    }
  } catch (error) {
    res.status(400).send("something went wrong")
  }
}

