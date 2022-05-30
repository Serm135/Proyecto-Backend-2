import app from '../app.js';
import request from 'supertest';
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

describe("post route tests", () => {
    beforeAll(() => {
        const url = process.env.DATABASE_URL
        mongoose.connect(url);
    })

    afterAll(() => {
        mongoose.connection.close()
    })

    test('/like', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user)
        const post = {
            post_id: '62929215f15dd388a1f896a6'
        }
        const {status} = await request(app).post('/posts/like').send(post)
        expect(status).toBe(202)    
    })

    test('/liked-by', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user)
        const {status,_body:body} = await request(app).get('/posts/liked-by?user_id=6292a3cfe25b6e63c08ab029')
        expect(status).toBe(202)   
        expect(body.message).toBe('Ok') 
    })

    test('/save', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user)
        const info = {
            post_id: '62929215f15dd388a1f896a6'
        }
        const {status,_body:body} = await request(app).post('/posts/save').send(info)
        expect(status).toBe(202)   
        expect(body.message).toBe('Ok') 
    })

    test('/saved-by', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user)
        const {status,_body:body} = await request(app).get('/posts/saved-by')
        expect(status).toBe(202)   
        expect(body.message).toBe('Ok') 
    })

    test('/comment', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user)
        const info = {
            post_id: '62929215f15dd388a1f896a6',
            comment: 'Confirmo, petrosky moment'
        }
        const {status,_body:body} = await request(app).post('/posts/').send(info)
        expect(status).toBe(202)   
        expect(body.message).toBe('Ok') 
    })

    test('/info', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user)
        const info = {
            post_id: '62929215f15dd388a1f896a6'
        }
        const {status,_body:body} = await request(app).get('/posts/').send(info)
        expect(status).toBe(202)   
        expect(body.message).toBe('Ok') 
    })

})