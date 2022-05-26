import express from 'express'
import userRoutes from './routes/users.routes.js'
import followRoutes from './routes/follows.routes.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())
app.use('/users',userRoutes)
app.use('/follows',followRoutes)

export default app