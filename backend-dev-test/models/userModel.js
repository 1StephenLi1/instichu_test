const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    birthday: Date,
    posts: [{
    	type: Schema.Types.ObjectId, 
    	ref: 'Post'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);