import supertest from 'supertest';
import app from '../../src/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { authTestUser, cleanerFunction, createBet } from '../helpers';

describe('Test des routes /bets', () => {
    let token1 = ''
    let token2 = ''
    let betId = 0
    beforeAll(async () => {
        await cleanerFunction()
        token1 = await authTestUser('betTest@alex.com', 'alex', 'password')
        token2 = await authTestUser('betTest2@alex.com', 'hugo', '123456')
        betId = await createBet(token1)
    })
    describe('GET /bets', () => {
        it('On essaye de récupérer tous les paris', async () => {
            const response = await supertest(app).get('/api/bets').set('Authorization', 'Bearer ' + token1).expect(200)
            expect(response.body.data).toBeInstanceOf(Array)
            expect(response.body.page).toBe(1)
            expect(response.body.pageSize).toBe(10)
            expect(response.body.total).toBeGreaterThan(0)
            expect(response.body.totalPages).toBeGreaterThan(0)
        })
        it('On essaye de récupérer tous les paris avec des paramètres de pagination', async () => {
            const response = await supertest(app).get('/api/bets').set('Authorization', 'Bearer ' + token1).query({
                page: 2,
                pageSize: 5
            }).expect(200)
            expect(response.body.data).toBeInstanceOf(Array)
            expect(response.body.page).toBe(2)
            expect(response.body.pageSize).toBe(5)
            expect(response.body.total).toBeGreaterThan(0)
            expect(response.body.totalPages).toBeGreaterThan(0)
        })
    })
    describe('POST /bets', () => {
        it('On esssaye de créer un pari', async () => {

            const response = await supertest(app).post('/api/bets').set('Authorization', 'Bearer ' + token1).send({
                title: 'Nouveau pari',
                description: 'Je vais lift 120kg en DL ce samedi'
            }).expect(201)

            expect(response.body).toHaveProperty('id')
            expect(response.body.title).toBe('Nouveau pari')
            betId = response.body.id
            console.log('BET CRÉÉ AVEC ID:', betId)
        })
        it('On veut créer un pari sans token', async () => {
            await supertest(app).post('/api/bets').send({
                title: 'Nouveau pari',
                description: 'Je vais lift 120kg en DL ce samedi'
            }).expect(401)
        })
        it('On veut créer un pari avec des données invalides', async () => {
            await supertest(app).post('/api/bets').set('Authorization', 'Bearer ' + token1).send({
                title: 23,
                description: 'Je vais lift 120kg en DL ce samedi'
            }).expect(400)
        })
    })
    describe('GET /bets/:id', () => {
        it('On veut récupérer un pari via son Id', async () => {
            const response = await supertest(app).get('/api/bets/' + betId).set('Authorization', 'Bearer ' + token1).expect(200)

            expect(response.body).toHaveProperty('id')
        })
        it('On veut récupérer un pari inexistant', async () => {
            await supertest(app).get('/api/bets/9999').set('Authorization', 'Bearer ' + token1).expect(404)
        })
        it('On veut récupérer un pari via son Id sans token', async () => {
            await supertest(app).get('/api/bets').expect(401)
        })
    })
    describe('PATCH /bets/:id', () => {
        it('On veut modifier un pari', async () => {
            await supertest(app).patch('/api/bets/' + betId).set("Authorization", 'Bearer ' + token1).send({
                title: 'Titre modifié',
                description: 'Description modifié'
            }).expect(200)
        })
        it('On veut modifier un pari qui \'est pas le nôtre', async () => {
            await supertest(app).patch('/api/bets/' + betId).set("Authorization", 'Bearer ' + token2).send({
                title: 'Titre modifié',
                description: 'Description modifié'
            }).expect(403)
        })
        it('On veut modifier un pari inexistant', async () => {
            await supertest(app).patch('/api/bets/999').set("Authorization", "Bearer " + token1).send({
                title: 'Titre modifié',
                description: 'Description modifié'
            }).expect(404)
        })
    })
    describe('DELETE /bets/:id', () => {
        console.log('TENTATIVE DELETE AVEC betId:', betId)
        it('On veut supprimer un pari qui n\'est pas le notre', async () => {
            await supertest(app).delete('/api/bets/' + betId).set('Authorization', 'Bearer ' + token2).expect(403)
        })
        it('On veut supprimer un pari inexistant', async () => {
            await supertest(app).delete('/api/bets/999').set('Authorization', 'Bearer ' + token2).expect(404)
        })
        it('On veut supprimer un pari', async () => {
            await supertest(app).delete('/api/bets/' + betId).set('Authorization', 'Bearer ' + token1).expect(200)
        })
    })


    afterAll(async () => {
        await cleanerFunction()
    })
})




describe('GET /api/bets', () => {
    it('Essaye de recevoir tous les bets, sinon retourne 401 si pas de token', async function () {
        await supertest(app).get('/api/bets').expect(401)
    })
})
