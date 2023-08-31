const router = require('express').Router()

const { ReadingLists, User } = require('../models')
const { tokenExtractor, sessionCheck } = require('../util/middleware')


router.get('/', async (req, res) => {
  const reading_list = await ReadingLists.findAll({
    attributes: { exclude: ['id', 'read'] }
  })
  res.json(reading_list)
})

router.put('/:id', sessionCheck, tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    req.reading_list = await ReadingLists.findByPk(req.params.id)
    console.log(user.id)
    if(user.id === req.reading_list.userId) {
    console.log(req.reading_list.userId)
    req.reading_list.read = !(req.reading_list.read)
    await req.reading_list.save()
    res.json(req.reading_list)
    }
  })


module.exports = router