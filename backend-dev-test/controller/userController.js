const User = require('../models/userModel.js');
const Post = require('../models/postModel.js');
var random_name = require('node-random-name');
var randomBirthday = require('random-birthday');
var randomstring = require("randomstring");
let DateGenerator = require('random-date-generator');

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

    User.findById(req.params.userId, (err, user) => {
        if (err) return res.json(err);
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
            user: req.params.userId
        });
        Post.create(post, (err, post) => {
            if (err) return res.json(err);
            user.posts.push(post);
            user.save((err) => {
                res.send(user);
            });
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

// Create a random user
function createAUser() {
    const user = new User({
        firstName: random_name({ first: true}),
        lastName: random_name({ last: true}),
        birthday: randomBirthday(),
        posts: []
    });
    user.save()
    .then(user => {
        console.log("Successfully saved a new user:");
        console.log(user);
        var posts = [];
        for (var i = 0; i < 10; i++) {
            const post = new Post({
                title: randomstring.generate(7),
                description: randomstring.generate(),
                createdAt: DateGenerator.getRandomDate(),
                user: user._id
            });
            posts.push(post);
        }
        Post.insertMany(posts)
        .then(function(posts) {
            console.log("Successfully insert posts.");
            console.log(posts);
            var postIds = [];
            posts.forEach(function(post) {
                postIds.push(post._id);
            });
            User.findOneAndUpdate({_id:user._id}, {$set:{posts:postIds}}, {new: true},
                function(err, user) {
                    if (err) {
                        console.log("Couldn't update user info");
                    }
                    console.log(user);
                });
        }).catch(function(err) {
            console.log("Insert error: " + err);
        });
    }).catch(err => {
        console.log("Error occured while saving users: " + err);
    });
}

module.exports.generateUsers = function(req, res) {
    var number = req.params.number;
    for (var i = 0; i < number; i++) {
        createAUser();
    }
    res.send("New users created.")
}
