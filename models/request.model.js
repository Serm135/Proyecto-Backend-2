import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
    from: {type: String, required:true},
    to: {type: String, required:true}
},{versionKey:false})

export default mongoose.model('request', requestSchema);