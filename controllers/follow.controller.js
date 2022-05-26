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
            await User.findOne({_id:data.user_id,followed:decoded}).then(dataDB=>{
                if(dataDB){
                    res.status(202).send(dataDB.followed)
                }else{
                    res.status(404).json('No se encontró el usuario o el usuario no lo sigue')
                }
            }).catch(e=>{
                console.log(e)
                res.status(404).json(e)
            })
        }else{
            res.status(404).json('Falta user_id')
        }
    }else{
        res.status(404).json('error')
    }
}

