import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    author: {type: String, required:true},
    img_url: {type: String, required:true},
    bio: {type: String, required:true},
    likes: [{type: String}],
    comments: [{type: String}]
},{versionKey:false})

export default mongoose.model('post', postSchema);