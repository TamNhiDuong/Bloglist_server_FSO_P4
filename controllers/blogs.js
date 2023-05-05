const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const _ = require('lodash')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    } catch (e) {
        next(e)
    }

})

blogsRouter.post('/', async (request, response, next) => {
    const reqBody = request.body

    const user = await User.findById(reqBody.userId)

    if (!_.has(reqBody, 'url') || !_.has(reqBody, 'title')) {
        return response.status(400).json({ error: 'content missing' })
    } else {
        if (!_.has(reqBody, 'likes')) {
            reqBody.likes = 0
        }
    }
    const clonedReqBody = _.omit(reqBody, 'userId')
    const blog = new Blog({ ...clonedReqBody, user: user.id })

    try {
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        response.status(201).json(result)
    } catch (e) {
        next(e)
    }

})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog)
    } catch (e) {
        next(e)
    }
})


module.exports = blogsRouter