// Run: npm test -- tests/blog_api.test.js
// Run a single test: npm test -- -t ""
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
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

    expect(response.body).toHaveLength(helper.initialBlogs.length)
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

    expect(response.body[0].id).toBeDefined()
}, 100000)

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Test adding a new blog",
        author: "Tester",
        url: "http://localhost:3003/api/blogs",
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
        'Test adding a new blog'
    )
}, 100000)

test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
        title: "Missing like property",
        author: "Tester",
        url: "http://localhost:3003/api/blogs"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    console.log('blogsAtEnd: ', blogsAtEnd)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const lastAddedBlog = blogsAtEnd.filter(blog => blog.title === "Missing like property")
    console.log('lastAddedBlog: ', lastAddedBlog)
    expect(lastAddedBlog[0].likes).toBe(0)
}, 100000)

test('if the title or url properties are missing, return error code 400', async () => {
    const newBlog = {
        author: "Tester",
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
}, 100000)


afterAll(async () => {
    await mongoose.connection.close()
})