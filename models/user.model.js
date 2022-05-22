import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {type: String, required:true},
    password: {type: String, required:true},
    salt:{type:String, required:true},
    email: {type: String, required:true},
    birthdate: {type: String, required:true},
    bio: {type: String, required:true}
},{versionKey:false})

export default mongoose.model('user', userSchema);