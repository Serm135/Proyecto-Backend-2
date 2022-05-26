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
            res.json({})
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
    if (data.post_id) {
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
        res.status(404).json('Faltan campos por llenar')
    }
}