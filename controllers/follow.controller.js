import User from '../models/user.model.js'
import jwtDecode from 'jwt-decode'

export const following = async (req,res) => {
    const data = req.query
    console.log(accessToken)
    try {
        var decoded = jwtDecode(accessToken)
    } catch (error) {
        console.log(error)
    }
    

}

