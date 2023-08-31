const router = require('express').Router()

const { Blog } = require('../models')
require('express-async-errors');
const { sequelize } = require('../util/db')


router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: ['author', [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']],
        group: 'author',
        order: [
            ['likes', 'DESC']
        ]
    })
    console.log(JSON.stringify(blogs))
    res.json(blogs)
})


module.exports = router

