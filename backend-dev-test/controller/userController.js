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

//Find all posts with special conditions
exports.findAllPosts = (req, res) => {
    var limit = 200;
    var title = '.';
    var method1 = "createdAt";
    var method1_sort = 'asc';
    var method2 = null;
    var method2_sort = 'asc';
    var sort = req.params.sort;
    if (req.params.option && req.params.option.includes("=")) {
        //Amount Limitation
        var string = req.params.option.split("=");
        var options = string[0];
        if (options === "limit") {
            limit = parseInt(string[1]);
        }
        //Title matching
        if (options === "title") {
            title = string[1];
        }
        //Sorting
        if (options === "sort") {
            var conditions = string[1];

            if (conditions.includes(",")) {
                var con_str = conditions.split(",");
                var con1 = con_str[0];
                var con2 = con_str[1];
                if (con1.includes(":")) {
                    method1 = con1.split(":")[0];
                    method1_sort = 'desc';
                } else {
                    method1 = con1;
                }
                if (con2.includes(":")) {
                    method2 = con2.split(":")[0];
                    method2_sort = 'desc';
                } else {
                    method2 = con2;
                }
            } else {
                if (conditions.includes(":")) {
                    method1 = conditions.split(":")[0];
                    method1_sort = 'desc';
                } else {
                    method1 = conditions;
                }
            }
        }
    }
    User.find({}, {"firstName": 1, "lastName": 1, "_id": 0})
    .limit(limit)
    .populate('posts',{'description':1, 'title':1, '_id':0, 'createdAt':1}, 
        {"title": {$regex: title, $options: "$i"}}, {sort: {[method1]: method1_sort, 
            [method2]: method2_sort}})
    .then(posts => {
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

module.exports.generateUsers = function(req, res) {
    var number = req.params.number;
    for (var i = 0; i < number; i++) {
        var user = userGenerator();
        console.log(user);
    }
    res.send("New users created.")
}

// Generate a random user
function userGenerator () {
    var firstName = random_name({ first: true});
    var lastName = random_name({ last: true});
    var birthday = randomBirthday();

    const user = new User({
        firstName: firstName,
        lastName: lastName,
        birthday: birthday
    });
    for (var i = 0; i < 10; i++) {
        var title = randomstring.generate(7);
        var description = randomstring.generate();
        var createdAt = DateGenerator.getRandomDate();
        const post = new Post({
            title: title,
            description: description,
            user: user._id,
            createdAt: createdAt
        });
        post.save(function(err){
            if(err){
                return err;
            }
        });
        user.posts.push(post._id);    
    }
    user.save(function(err){
        if(err){
            return err;
        }
    });
    return user;
}
