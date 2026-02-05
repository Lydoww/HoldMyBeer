import supertest from 'supertest';
import app from '../../src/app';
import { beforeAll, describe, expect, it } from 'vitest'
import { cleanerFunction } from '../helpers';


describe('Test des routes /auth', () => {
    beforeAll(async () => {
        await cleanerFunction()
    })
    describe('POST /register', () => {
        it('On créer un utilisateur', async () => {
            const response = await supertest(app).post('/api/auth/register').send({
                email: 'authTest@test.com',
                username: 'alexisss',
                password: 'password123456789'
            }).expect(201)
            expect(response.body.user).toHaveProperty('id')
            expect(response.body.user).not.toHaveProperty('password')
            expect(response.body.user.email).toBe('authTest@test.com')
        })
        it('On créer un utilisateur mais l\'email est déjà utilisé', async () => {
            await supertest(app).post('/api/auth/register').send({
                email: 'authTest@test.com',
                username: 'alexisss',
                password: 'password123456789'
            }).expect(400)
        })
        it('On créer un utilisateur mais sans les bonnes données d\email', async () => {
            await supertest(app).post('/api/auth/register').send({
                email: 23,
                username: 'alexisss',
                password: 'password123456789'
            }).expect(400)
        })
        it('On créer un utilisateur mais sans password', async () => {
            await supertest(app).post('/api/auth/register').send({
                email: 'authTest@test.com',
                username: 'alexisss',
            }).expect(400)
        })
    })

    describe('POST /login', () => {
        it('On essayer de connecter un utilisateur', async () => {
            const response = await supertest(app).post('/api/auth/login').send({
                email: 'authTest@test.com',
                password: 'password123456789'
            }).expect(200)
            expect(response.body.token).toBeDefined() // vérifie que le body n'est pas vide/undefined
            expect(typeof response.body.token).toBe('string')
        })
        it('On essayer de connecter un utilisateur avec les mauvaises données', async () => {
            await supertest(app).post('/api/auth/login').send({
                email: 'authTest@test.com',
            }).expect(400)
        })
        it('On essayer de connecter un utilisateur avec un mauvais email', async () => {
            await supertest(app).post('/api/auth/login').send({
                email: 'alexxxxxx@test.com',
                password: 'password123456789'
            }).expect(401)
        })
        it('On essayer de connecter un utilisateur avec un mauvais password', async () => {
            await supertest(app).post('/api/auth/login').send({
                email: 'alex@test.com',
                password: 'password12345678910'
            }).expect(401)
        })
    })
})