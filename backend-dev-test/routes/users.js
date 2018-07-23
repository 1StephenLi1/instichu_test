module.exports = (app) => {
    const users = require('../controller/userController.js');

    // Create a new User
    app.post('/users', users.createUser);

    // Retrieve a single User with userId
    app.get('/users/:userId', users.findOneUser);

    //Create a new post
    app.post('/users/:userId/posts', users.createPost);

    // Retrieve all posts by an user
    app.get('/users/:userId/posts', users.findAllPostsById);

    // Retrieve one post by an user
    app.get('/users/:userId/posts/:postId', users.findOnePostById);
}