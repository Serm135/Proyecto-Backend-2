import User from '../models/user.model.js'
import Post from '../models/post.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'
import mongoose from 'mongoose'

global.accessToken = ''
dotenv.config()

export const login = async (req,res) => {
    const data = req.body
    if (data.username && data.password) {
        await User.find({username:data.username}).then(dataDB=>{
            if(dataDB!=''){
                const hash = crypto.pbkdf2Sync(data.password,dataDB[0].salt,1000,64,'sha512').toString('hex')
                User.find({username:data.username,password: hash}).then(dataDB=>{
                if(dataDB!=''){
                    accessToken = generateAccessToken(data.username)
                    res.header('authorization',accessToken).json({
                        message:'Usuario autenticado',
                        token:accessToken
                    })
                }else{
                    res.status(404).send([])
                }
                }).catch(e=>{
                console.log(e)
                res.status(500).json({
                    error:e
                })
                })
            }else{
                res.status(404).json('No se encontró el usuario')
            }
        })
        
    }else{
        const Token = req.headers['authorization']
        if(Token){
            jwt.verify(Token,process.env.SECRET,(err,user)=>{
                if(err){
                    res.send('Token expired or incorrect')
                }else{
                    res.status(201).json({message:'Acceso exitoso'})
                }
            })
        }
    }
};

export const register = async (req,res) => {
    const data = req.body
    if (data.username && data.password && data.email && data.birthdate && data.bio) {
        await User.find({email:data.email}).then(dataDB=>{
            if(dataDB==''){
                User.find({username:data.username}).then(dataDB=>{
                    if(dataDB==''){
                        const salt = crypto.randomBytes(16).toString('hex')
                        const hash = crypto.pbkdf2Sync(data.password,salt,1000,64,'sha512').toString('hex')
                        const newuser = new User({
                            username: data.username,
                            password: hash,
                            salt:salt,
                            email: data.email,
                            birthdate: data.birthdate,
                            bio: data.bio,
                            likeallowed: true,
                            savedposts:[],
                            followed:[]
                        })
                        newuser.save().then(result =>{
                            console.log("Éxito "+result)
                            accessToken = generateAccessToken(data.username)
                            res.header('authorization',accessToken).json({
                            message:'Usuario autenticado',
                            token:accessToken
                        })
                        }).catch(e=>{
                            console.log(e)
                            res.status(500).json({
                                error:e
                            })
                        })
                    }else{
                        res.status(404).json('El Username ya se encuentra usado')
                    }
                })
            }else{
                res.status(404).json('El Email ya se encuentra usado')
            }
        }).catch(e=>{
            console.log(e)
            res.status(500).json({
                error:e
            })
        })
    }else{
        res.status(404).json('Faltan campos por llenar')
    }
};
export const information = async (req,res) => {
    const data = req.body
    const _id = mongoose.Types.ObjectId(data.user_id)
    const pipeline = [
        {$match:{_id:_id}},
        {$project:{"_id":0,"username":1, "email":1, "bio":1, "followed":1}}
    ]
    await User.aggregate(pipeline).then(dataDB => {
        Post.find().then(posts => {
            User.find().then(users => {
                dataDB = dataDB[0]
                const info = {
                    username: dataDB.username, 
                    email: dataDB.email, 
                    bio: dataDB.bio, 
                    liked_count: (posts.filter(post=>{return post.likes.includes(dataDB.username)}).length), 
                    posts_count: (posts.filter(post=>{return post.author==dataDB.username}).length),
                    followers_count: (users.filter(user=>{return user.followed.includes(dataDB.username)}).length),
                    followed_count: (dataDB.followed).length

                }
                res.status(202).json(info)
            }).catch(e=>{
                console.log(e)
            })
        }).catch(e=>{
            console.log(e)
        })
    }).catch(e=>{
        console.log(e)
    })
}

function generateAccessToken(user){
    return jwt.sign(JSON.stringify(user),process.env.SECRET)
}

//export default { accessToken: accessToken } 