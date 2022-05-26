import User from '../models/user.model.js'
import jwtDecode from 'jwt-decode'

export const following = async (req,res) => {
    const data = req.query
    if(accessToken!=''){
        try {
            var decoded = jwtDecode(accessToken)
        } catch (error) {
            console.log(error)
            res.status(404).json(error)
        }
        if(data.user_id){
            await User.findOne({_id:data.user_id}).then(dataDB=>{
                if(dataDB){
                    if(dataDB.username==decoded){
                        res.status(202).send(dataDB.followed)
                    }else if((dataDB.followed).find(item=>item=decoded)){
                        res.status(202).send(dataDB.followed)
                    }else{
                        res.status(404).json('El usuario no lo sigue')
                    }
                }else{
                    res.status(404).json('No se encontró el usuario')
                }
            }).catch(e=>{
                console.log(e)
                res.status(404).json(e)
            })
        }else{
            res.status(404).json('Falta user_id')
        }
    }else{
        res.status(404).json('Token error')
    }
}

export const followers = async (req,res) => {
    const data = req.query
    if(accessToken!=''){
        try {
            var decoded = jwtDecode(accessToken)
        } catch (error) {
            console.log(error)
            res.status(404).json(error)
        }
        if(data.user_id){
            await User.findOne({_id:data.user_id}).then(dataDB=>{
                if(dataDB){
                    if(dataDB.username==decoded){
                        User.find({followed:dataDB.username}).then(dataDBf=>{
                            const users = dataDBf.map(item=>item.username)
                            res.status(202).send(users)
                        }).catch(e=>{
                            console.log(e)
                            res.status(404).json(e)
                        })
                    }else if((dataDB.followed).find(item=>item=decoded)){
                        User.find({followed:dataDB.username}).then(dataDBf=>{
                            const users = dataDBf.map(item=>item.username)
                            res.status(202).send(users)
                        }).catch(e=>{
                            console.log(e)
                            res.status(404).json(e)
                        })
                    }else{
                        res.status(404).json('El usuario no lo sigue')
                    }
                }else{
                    res.status(404).json('No se encontró el usuario')
                }
            }).catch(e=>{
                console.log(e)
                res.status(404).json(e)
            })
        }else{
            res.status(404).json('Falta user_id')
        }
    }else{
        res.status(404).json('Token error')
    }
}