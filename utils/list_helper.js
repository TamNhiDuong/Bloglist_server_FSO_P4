const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const initialValue = 0
    const totalLikes = blogs.reduce((accumulator, item) => accumulator + item.likes, initialValue)
    return totalLikes
}

module.exports = {
    dummy,
    totalLikes
}
