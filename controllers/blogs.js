const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const _ = require('lodash')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } catch (e) {
        next(e)
    }

})

blogsRouter.post('/', async (request, response, next) => {
    const reqBody = request.body
    
    if(!_.has(reqBody, 'url') || !_.has(reqBody, 'title')) {
        return response.status(400).json({ error: 'content missing' })
    } else {
        if (!_.has(reqBody, 'likes')) {
            reqBody.likes = 0
        } 
    }
    const blog = new Blog(reqBody)
    try {
        const result = await blog.save()
        response.status(201).json(result)
    } catch (e) {
        next(e)
    }

})

module.exports = blogsRouter