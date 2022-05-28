import User from '../models/user.model.js'
import Request from '../models/request.model.js'
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

export const request = async(req,res) => {
    const data = req.body
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
                    if(dataDB.username!=decoded){
                        if((dataDB.followed).find(item=>item=decoded)){
                            res.status(404).json('Ya se encuentra siguiendo al usuario')
                        }else{
                            const newreq = new Request({
                                from: decoded,
                                to: dataDB.username
                            })
                            newreq.save().then(result=>{
                                res.status(202).json('Realizado Correctamente')
                            }).catch(e=>{
                                console.log(e)
                                res.status(500).json({
                                    error:e
                                })
                            })
                        }
                    }else{
                        res.status(404).json('Solicitud incorrecta')
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

export const response = async(req,res) => {
    const data = req.body
    if(accessToken!=''){
        try {
            var decoded = jwtDecode(accessToken)
        } catch (error) {
            console.log(error)
            res.status(404).json(error)
        }
        if(data.request_id && data.action){
            await Request.findOne({_id:data.request_id}).then(dataDB=>{
                if(dataDB){
                    if(dataDB.to == decoded){
                        if(data.action=='accept'){ 
                            User.updateOne({username:dataDB.from},{$push:{followed:[dataDB.to]}}).then(result=>{
                                Request.deleteOne({from:dataDB.from},{to:dataDB.to}).then(
                                    res.status(202).json('Realizado Correctamente')
                                ).catch(e=>{
                                    console.log(e)
                                    res.status(500).json({
                                        error:e
                                    })
                                })
                            }).catch(e=>{
                                console.log(e)
                                res.status(500).json({
                                    error:e
                                })
                            })
                        }else if(data.action=='reject'){
                            Request.deleteOne({from:dataDB.from},{to:dataDB.to}).then(
                                res.status(202).json('Realizado Correctamente')
                            ).catch(e=>{
                                console.log(e)
                                res.status(500).json({
                                    error:e
                                })
                            })
                        }else{
                            res.status(404).json('Solicitud incorrecta')
                        }
                    }else{
                        res.status(404).json('Al usuario no le pertenece esta solicitud')
                    }
                    
                }else{
                    res.status(404).json('No se encontró la petición')
                }
            }).catch(e=>{
                console.log(e)
                res.status(404).json(e)
            })
        }else{
            res.status(404).json('Faltan datos')
        }
    }else{
        res.status(404).json('Token error')
    }
}