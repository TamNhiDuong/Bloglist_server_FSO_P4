const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const _ = require('lodash')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const reqBody = request.body
    if(!_.has(reqBody, 'likes')) {
        reqBody.likes = 0
    }
    const blog = new Blog(reqBody)
    console.log('Going to add this blog: ', blog)
    const result = blog.save()
    response.status(201).json(result)
})

module.exports = blogsRouter