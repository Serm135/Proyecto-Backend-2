import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const login = async (req,res) => {
    const data = req.body
    if (data.username && data.password) {
        await User.find({username:data.username,password: data.password}).then(dataDB=>{
            if(dataDB!=''){
                console.log(data.username)
                const accessToken = generateAccessToken(data.username)
                console.log(accessToken)
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
                const newuser = new User({
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    birthdate: data.birthdate,
                    bio: data.bio
                })
                newuser.save().then(result =>{
                    console.log("Éxito "+result)
                    const accessToken = generateAccessToken(data.username)
                    console.log(accessToken)
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

function generateAccessToken(user){
    return jwt.sign(user,process.env.SECRET)
}

