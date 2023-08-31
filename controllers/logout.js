const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session');

//this delete "user's all sessions"
router.delete('/', async (req, res) => {
  const authorization = req.get('authorization')
  req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    
 //const user = await User.findByPk(req.decodedToken.id)
  
//   if (user.disabled) {
//     return response.status(401).json({
//       error: 'account disabled, please contact admin'
//     })
//   }

//   const userForToken = {
//     username: user.username,
//     id: user.id,
//   }

  //const token = jwt.sign(userForToken, SECRET)
  //const loginedUser = await User.findByPk(req.decodedToken.id)
  //console.log(req.decodedToken)
  const result = await Session.destroy({where: { userId: req.decodedToken.id}})

  res
    .status(200)
    .send({ result })
})

module.exports = router