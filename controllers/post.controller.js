import Post from "../models/post.model.js"

export const create = async (req,res) => {
    const data = req.body
    if (data.author && data.img_url && data.bio) {
        const newPost = new Post({
            author: data.author,
            img_url: data.img_url,
            bio: data.bio,
            likes: [],
            comments:[]
        })
        console.log(newPost)
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
}
export const information = async (req,res) => {
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
                res.json(post_info)
            } else {
                res.status(404).json('No se encontró la publicación')
            }
        }).catch(e=>{
                console.log(e)
                res.status(500).json({
                    error:e
                })
            })
    }else{
        res.status(404).json('No se encontró la publicación')
    }
}
export const like = async (req, res) =>{
    const data = req.body
    if (data.post_id.length==24) {
        await Post.findOne({_id:data.post_id}).then(dataDB => {
            if (dataDB) {
                let likes = dataDB.likes
                const user = "jhonnaar"
                if (!likes.find(like =>{return like==user})) {
                    likes.push(user)
                    Post.updateOne({_id:data.post_id},{$set:{likes:likes}}).then(r =>{
                        res.status(202).json({})
                    }).catch(e =>{
                        console.log(e)
                        res.status(404)
                    })
                } else {
                    res.status(404).json('Ya dio like a esta publicación')
                }
                
            } else {
                res.status(404).json('No se encontró la publicación')
            }
        })
    } else {
        res.status(404).json('No se encontró la publicación')
    }
}