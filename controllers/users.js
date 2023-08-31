const router = require('express').Router()

const { User, Blog } = require('../models')

const { tokenExtractor, sessionCheck } = require('../util/middleware')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [{
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
    ]
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } })
  next()
}

router.put('/:username', sessionCheck, userFinder, async (req, res) => {
  //if (req.user) {
  console.log(req.user.username)
  req.user.username = req.body.username//check
  await req.user.save()
  res.json(req.user)
  // }
  // else {
  //   //   //throw new Error("error");
  //   res.status(404).end({ error: 'not found' })
  // }
  // res.status(204).end()
  // else {
  //   res.status(404).end("error occur")
  // }
})

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.put('/admin/:username', sessionCheck, tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read) {
    where.read = req.query.read === "true"
  }
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['read', 'id'],
          where
        },
      }
    ]
  })
  if (user) {
    // const reading_list = await ReadingLists.findAll({
    //   attributes: { include: ['blogId'] }
    // })
    // const reading = await Blog.findAll(reading_list)

    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router