const User = require('../models/userModel.js');
const Post = require('../models/postModel.js');

// Create and Save a new user.
exports.createUser = (req, res) => {
	if(!req.body.firstName) {
    	return res.status(400).send({
        	message: "User's name can not be empty"
        });
    }
    const user = new User({
    	firstName: req.body.firstName,
    	lastName: req.body.lastName,
    	birthday: req.body.birthday
    });
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
};

//Find an user by id.
exports.findOneUser = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

//Create a new post under an user.
exports.createPost = (req, res) => {
	if(!req.params.userId) {
    	return res.status(400).send({
        	message: "User's id can not be empty"
        });
    } else if (!req.body.description) {
    	return res.status(400).send({
        	message: "Description can not be empty"
        });
    }
    const post = new Post({
    	title: req.body.title,
    	description: req.body.description,
    	user: req.params.userId
    });
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        user.posts.push(post._id);
        user.save(function(err) {
            if (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the post"
                }); 
            }
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
    post.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the post"
        });
    });
};

//Find all posts which are posted by an user.
exports.findAllPostsById = (req, res) => {
    Post.find({user: req.params.userId})
    .then(posts => {
        if(!posts) {
            return res.status(404).send({
                message: "Post not found with id " + req.params.userId
            });            
        }
        res.send(posts);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

//Find one post which is posted by an user.
exports.findOnePostById = (req, res) => {
	Post.find({user: req.params.userId, _id: req.params.postId})
	.then(posts => {
        if(!posts) {
            return res.status(404).send({
                message: "Post not found with id " + req.params.userId
            });            
        }
        res.send(posts);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};