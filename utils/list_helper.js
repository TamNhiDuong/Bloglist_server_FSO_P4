const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const initialValue = 0
    const totalLikes = blogs.reduce((accumulator, item) => accumulator + item.likes, initialValue)
    return totalLikes
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return {}
    }
    const maxLikes = Math.max(...blogs.map(e => e.likes))
    const objWithMaxLikes = blogs.find(blog => blog.likes === maxLikes)
    const { _id, url, __v, ...returnBlogObj } = objWithMaxLikes
    return returnBlogObj
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
