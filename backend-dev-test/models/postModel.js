const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({
    title: String,
    description: String,
    user: [{type: String, ref: 'User', required: true}]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);