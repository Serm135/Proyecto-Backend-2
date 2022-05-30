import app from '../app.js';
import request from 'supertest';
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

describe("user route tests", () => {
    beforeAll(() => {
        const url = process.env.DATABASE_URL
        mongoose.connect(url);
    })

    afterAll(() => {
        mongoose.connection.close()
    })

    test('/resgister', async () => {
        const user = {
            username: 'test1',
            password: "1111",
            email:"test@gmail.com",
            birthdate:"31/12/1999",
            bio:"test"
        }
        const {status, _body: body} = await request(app).post('/users/').send(user)
        expect(status).toBe(202)    
        expect(body.message).toBe("Usuario autenticado")
    })

    test('/resgister fail', async () => {
        const user = {
            password: "1234",
            email:"pinilloss@gmail.com",
            birthdate:"31/12/1999",
            bio:"Juego al LoL y por eso me odio"
        }
        const {status, _body: body} = await request(app).post('/users/').send(user)
        expect(status).toBe(404)    
        expect(body.message).toBe("Faltan campos por llenar")
    })

    test('/login fail user', async () => {
        const user = {
            username: 'pinill',
            password: "1234"
        }
        const {status, _body: body} = await request(app).post('/users/login').send(user)
        expect(status).toBe(404)    
        expect(body.message).toBe("No se encontró el usuario")
    })

    test('/login fail pass', async () => {
        const user = {
            username: 'pinilloss',
            password: "12"
        }
        const {status, _body: body} = await request(app).post('/users/login').send(user)
        expect(status).toBe(404)    
        expect(body.message).toBe("Contraseña incorrecta")
    })

    test('/login', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        const {status, _body: body} = await request(app).post('/users/login').send(user)
        expect(status).toBe(202)    
        expect(body.message).toBe("Usuario autenticado")
    })

    test('/info', async () => {
        const user = {
            user_id: '6292a3cfe25b6e63c08ab029'
        }
        const {status, _body: body} = await request(app).get('/users/').send(user)
        expect(status).toBe(202)    
        expect(body.message).toBe("Ok")
        expect(body.info.birthdate).toBeUndefined()
        expect(body.info.password).toBeUndefined()
        expect(body.info.posts_count).toBe(1)
        expect(body.info.liked_count).toBe(1)
        expect(body.info.followers_count).toBe(0)
        expect(body.info.followed_count).toBe(1)
    })
})
