const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Test1",
        author: "10-334",
        url: "http://localhost:3003/api/blogs",
        likes: 10,
        id: "6449145ea146b589491b7f3e"
    },
    {
        title: "Test2",
        author: "10-334",
        url: "http://localhost:3003/api/blogs",
        likes: 10,
        id: "64491464a146b589491b7f40"
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
        'Test1'
    )
}, 100000)

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    console.log('res: ', response.body)
    expect(response.body[0].id).toBeDefined()
}, 100000)

afterAll(async () => {
    await mongoose.connection.close()
})