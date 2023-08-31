const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User, Session } = require('../models')
const { SECRET } = require('../util/config')
require('express-async-errors');
const { Op } = require('sequelize')
const { tokenExtractor, sessionCheck } = require('../util/middleware');



router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search
        }
      },
      {
        author: {
          [Op.substring]: req.query.search
        }
      }
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post('/', sessionCheck, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.json(blog)
})


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    //throw new Error("error");
    res.status(404).end({ error: 'not found' })
  }
})


router.delete('/:id', blogFinder, sessionCheck, tokenExtractor, async (req, res) => {
  if (req.blog) {
    const user = await User.findByPk(req.decodedToken.id)
    if(user.id===req.blog.userId) {
    await req.blog.destroy()
    } else {
      throw new Error("not permitted to delete");
    }
  } else {
  throw new Error("blog not found");
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, sessionCheck, async (req, res) => {
  if (req.blog) {
    console.log(req.blog.likes)
    req.blog.likes = req.blog.likes + 1;
    console.log(req.blog.likes)
    await req.blog.save()
    res.json(req.blog)
  } else {
    //throw new Error("error");
    res.status(404).end({ error: 'not found' })
  }
  res.status(204).end()
  // else {
  //   res.status(404).end("error occur")
  // }
})


module.exports = router


// const router = require('express').Router()
// require('express-async-errors')

// const { Blog } = require('../models')


// router.get('/', async (req, res) => {
//   const blogs = await Blog.findAll()
//   console.log(JSON.stringify(blogs))
//   res.json(blogs)
// })

// router.post('/', async (req, res) => {
//   try {
//     const blog = await Blog.create(req.body)
//     return res.json(blog)
//   } catch (error) {
//     return res.status(400).json({ error })
//   }
// })


// const blogFinder = async (req, res, next) => {
//   req.blog = await Blog.findByPk(req.params.id)
//   next()
// }

// router.get('/:id', blogFinder, async (req, res) => {
//   if (req.blog) {
//       res.json(req.blog)
//   } else {
//       res.status(404).end()
//   }
// })


// router.delete('/:id', blogFinder, async (req, res) => {
//   if (req.blog) {
//     await req.blog.destroy();
//   }
//   res.status(204).end()
// })

// router.put('/:id', blogFinder, async (req, res) => {
//   if (req.blog) {
//     req.blog.likes = req.body.likes + 1;
//     await req.blog.save()
//     res.json(req.blog)
//   } else {
//     res.status(404).end()
//   }
// })

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// // handler of requests with unknown endpoint
// app.use(unknownEndpoint)

// const errorHandler = (error, request, response, next) => {
//   console.error(error.message)
// //if (error.name === 'CastError')
//   if (error.name) {
//     return response.status(400).send({ error: 'error occur' })
//   } 

//   next(error)
// }

// // this has to be the last loaded middleware.
// app.use(errorHandler)


// module.exports = router