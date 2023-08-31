const { Session } = require('../models')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.name)
  //if (error.name === 'CastError')
  //if(error.name === 'SequelizeValidationError') {
  return response.status(400).send({ error: error.message })
  // } else if (error) {
  //     return response.status(400).send({ error: error.message})
  // }
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


const sessionCheck = async (req, res, next) => {
  const authorization = req.get('authorization')
  const session = await Session.findOne({ where: { tokenString: authorization.substring(7) } })
  if (session !== null) {
    console.log(session)
  } else {
    return res.status(401).json({ error: 'session expired' })
  }
  next()
}


module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  sessionCheck
}