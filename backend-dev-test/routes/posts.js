module.exports = (app) => {
    const posts = require('../controller/postController.js');

    // Retrive all posts with special conditions
    app.get('/posts/:option?', posts.findAllPosts);
}