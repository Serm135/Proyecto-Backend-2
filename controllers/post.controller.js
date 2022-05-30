import Post from "../models/post.model.js"
import jwtDecode from 'jwt-decode'
import User from '../models/user.model.js'

export const create_comment = async (req,res) => {
    const data = req.body
    if (Object.keys(data).indexOf("comment")<0) {
        if (data.author && data.img_url && data.bio) {
            const newPost = new Post({
                author: data.author,
                img_url: data.img_url,
                bio: data.bio,
                likes:[],
                comments:[]
            })
            newPost.save().then(result => {
                res.status(202).json({})
            }).catch(e=>{
                    console.log(e)
                    res.status(500).json({
                        error:e
                    })
                })
    
        } else {
            res.status(404).json('Faltan campos por llenar')
        }
    } else {
        if (data.post_id && data.comment) {
            await Post.findById(data.post_id).then(dataDB => {
                let comments = dataDB.comments
                comments.push(data.comment)
                Post.updateOne({_id:data.post_id},{$set:{comments:comments}}).then(r =>{
                    res.status(202).json({message:'Ok'})
                }).catch(e =>{
                    console.log(e)
                    res.status(500)
                })
            }).catch(e=>{
                console.log(e)
                res.status(404)
            })
        } else {
            res.status(404).json('Faltan campos por llenar')
        }
        
    }
    
}
export const information = async (req,res) => {
    if (!req.query || req.query!='') {
        const data = req.body
        if (data.post_id.length==24) {
            await Post.findOne({_id:data.post_id}).then(dataDB => {
                if (dataDB) {
                    const post_info = {
                        img_url: dataDB.img_url,
                        bio: dataDB.bio,
                        author: dataDB.author,
                        likes: dataDB.likes.length,
                        comments: dataDB.comments
                    }
                    res.status(202).json({message:'Ok',post_info})
                } else {
                    res.status(404).json({message:'No se encontró la publicación'})
                }
            }).catch(e=>{
                    console.log(e)
                    res.status(500).json({
                        error:e
                    })
                })
        }else{
            res.status(404).json({message:'No se encontró la publicación'})
        }
    } else {
        const data = req.query
        if (data.author) {
            await Post.find({author:data.author}).then(dataDB => {
                res.status(202).json(dataDB)
            }).catch(e=>{
                console.log(e)
                res.status(404).json(e)
            })
        } else {
            res.status(404).json({message:'Faltan campos por llenar'})
        }
    }
    
}
export const like = async (req, res) =>{
    const data = req.body
    if (accessToken!="") {
        if (data.post_id.length==24) {
            await Post.findOne({_id:data.post_id}).then(dataDB => {
                if (dataDB) {
                    let likes = dataDB.likes
                    try {
                        var decoded = jwtDecode(accessToken)
                    } catch (error) {
                        console.log(error)
                        res.status(404).json(error)
                    }
                    if (!likes.find(like =>{return like==decoded})) {
                        likes.push(decoded)
                        Post.updateOne({_id:data.post_id},{$set:{likes:likes}}).then(r =>{
                            res.status(202).json({})
                        }).catch(e =>{
                            console.log(e)
                            res.status(404)
                        })
                    } else {
                        res.status(404).json({message:'Ya dio like a esta publicación'})
                    }
                    
                } else {
                    res.status(404).json('No se encontró la publicación')
                }
            })
        } else {
            res.status(404).json('No se encontró la publicación')
        }
    } else {
        res.status(404).json('Debe estar logueado')
    }
}
export const liked_by = async (req, res) => {
    const data = req.query
    if (data.user_id!="") {
        await User.findOne({_id:data.user_id}).then(dataDB => {
            if (dataDB) {
                if (dataDB.likeallowed) {
                    Post.find().then(posts => {
                        if (posts) {
                            let likedposts = posts.filter(post => {
                                if (post.likes.find(like=>{return like==dataDB.username})) {
                                    return post
                                }
                            })
                            res.status(202).json({message:'Ok',likedposts})
                        } else {
                            res.status(404).json({message:'F'})
                        } 
                    }).catch(e=>{
                        console.log(e)
                        res.status(500).json({message:'Error'})
                    })
                } else {
                    res.status(404).json({message:'El usuario no permite ver sus "me gusta'})
                }
            } else {
                res.status(404).json({message:'No se encontró al usuario'})
            }
        }).catch(e=>{
            console.log(e)
            res.status(404).json({message:'No se encontró al usuario'})
        })
    } else {
        res.status(404).json({message:'User id incorrecto'})
    }
}
export const saved_by = async (req, res) => {
    if (accessToken!="") {
        try {
            var decoded = jwtDecode(accessToken)
        } catch (error) {
            console.log(error)
            res.status(404).json(error)
        }
        let savedposts = []
        await User.findOne({username:decoded}).then(dataDB =>{
                Post.find().then(posts=>{
                    dataDB.savedposts.map(post_id => {
                        posts.map(post=>{
                            if (post._id==post_id) {
                                savedposts.push(post)
                            }
                        })
                    })
                    res.status(202).json({message:'Ok',savedposts})
                }).catch(e=>{
                    console.log(e)
                    res.status(404).json('No hay publicaciones')
                })
        }).catch(e=>{
            console.log(e)
            res.status(500).json('Error')
        })
    } else {
        res.status(404).json('Debe estar logueado')
    }
}
export const save = async (req, res) => {
    const data = req.body
    if (accessToken!="") {
        try {
            var decoded = jwtDecode(accessToken)
        } catch (error) {
            console.log(error)
            res.status(404).json(error)
        }
        await User.findOne({username:decoded}).then(dataDB =>{
            let saved = dataDB.savedposts
            saved.push(data.post_id)
            User.updateOne({_id:dataDB._id},{$set:{savedposts:saved}}).then(r =>{
                res.status(202).json({message:'Ok'})
            }).catch(e =>{
                console.log(e)
                res.status(404).json({message:'F'})
            })
        }).catch(e=>{
            console.log(e)
            res.status(500).json({message:'Error'})
        })
    } else {
        res.status(404).json({message:'Debe estar logueado'})
    }
}
export const timeline = async (req,res) => {
    const data = req.body
    if (accessToken!="") {
        const page = {
            page:data.page,
            size:2
        }
        try {
            var decoded = jwtDecode(accessToken)
        } catch (error) {
            console.log(error)
            res.status(404).json({})
        }
        await Post.find({author:decoded}).skip((page.page-1)*page.size).limit(page.size).then(dataDB => {
            res.status(202).json(dataDB)
        }).catch(e=>{
            console.log(e)
            res.status(404)
        })

    } else {
        res.status(404).json('Debe estar logueado')
    }

}