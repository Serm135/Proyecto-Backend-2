import mongoose from 'mongoose'
const url = 'mongodb+srv://jhonnaar:gokuque@cluster0.49scg.mongodb.net/picshar-db?retryWrites=true&w=majority'

mongoose.connect(url)
    .then(db=> console.log("Db is connected"))
    .catch(error=> console.log(error))