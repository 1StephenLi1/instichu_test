const User = require('../models/userModel.js');
const Post = require('../models/postModel.js');

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


