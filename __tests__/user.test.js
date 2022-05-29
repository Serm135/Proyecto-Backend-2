import app from '../app.js';
import requestdb from '../models/request.model.js'
import request from 'supertest';
import mongoose from "mongoose";

describe("user route tests", () => {
    beforeAll(() => {
        const url = "mongodb+srv://pinilloss:gokuque@cluster0.49scg.mongodb.net/picshar-db?retryWrites=true&w=majority"
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

})
