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

    test('/followers', async () => {
        const user = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user)
        const {status, _body: body} = await request(app).get('/follows/followers?user_id=6293d8b73ed8c34141ee6c62')
        expect(status).toBe(202)    
        expect(body.message).toBe("Ok")
    })

    test('/following', async () => {
        const {status, _body: body} = await request(app).get('/follows/following?user_id=6293d8b73ed8c34141ee6c62')
        expect(status).toBe(202)    
        expect(body.message).toBe("Ok")
    })
    
    test('/request', async () => {
        const info = {
            user_id: '6292919ff15dd388a1f896a4'
        }
        const {status, _body: body} = await request(app).post('/follows/request').send(info)
        expect(status).toBe(202)    
        expect(body.message).toBe("Realizado Correctamente")
    })

    test('/responseAccept', async () => {
        const requestres = await requestdb.findOne({from:'pinilloss',to:'juan'})
        const info = {
            request_id: requestres._id,
            action: 'accept'
        }
        const user = {
            username: 'juan',
            password: "2222"
        }
        const {status:statusl, _body: bodyl} = await request(app).post('/users/login').send(user)
        expect(statusl).toBe(202)    
        expect(bodyl.message).toBe("Usuario autenticado")
        const {status, _body: body} = await request(app).post('/follows/response').send(info)
        expect(status).toBe(202)    
        expect(body.message).toBe("Realizado Correctamente")
        const {status:statusf, _body: bodyf} = await request(app).post('/follows/response').send(info)
        expect(statusf).toBe(404)    
        expect(bodyf.message).toBe("Petición no encontrada o respondida")
    })

    test('/responseReject', async () => {
        const user1 = {
            username: 'pinilloss',
            password: "1234"
        }
        await request(app).post('/users/login').send(user1)
        const info1 = {
            user_id: '6292919ff15dd388a1f896a4'
        }
        const {status:statusI, _body: bodyI} = await request(app).post('/follows/request').send(info1)
        expect(statusI).toBe(202)
        expect(bodyI.message).toBe("Realizado Correctamente")
        const requestres = await requestdb.findOne({from:'pinilloss',to:'juan'})
        const info = {
            request_id: requestres._id,
            action: 'reject'
        }
        const user = {
            username: 'juan',
            password: "2222"
        }
        await request(app).post('/users/login').send(user)
        const {status, _body: body} = await request(app).post('/follows/response').send(info)
        expect(status).toBe(202)    
        expect(body.message).toBe("Realizado Correctamente")
        const {status:statusf, _body: bodyf} = await request(app).post('/follows/response').send(info)
        expect(statusf).toBe(404)    
        expect(bodyf.message).toBe("Petición no encontrada o respondida")
    })

})
