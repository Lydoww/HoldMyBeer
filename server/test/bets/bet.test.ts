import supertest from 'supertest';
import app from '../../src/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { authTestUser, cleanerFunction, createBet, createVote } from '../helpers';
import prisma from '../../src/lib/db';

describe('Test des routes /bets', () => {
    let token1 = ''
    let token2 = ''
    let token3 = ''
    let betId = 0
    beforeAll(async () => {
        await cleanerFunction()
        token1 = await authTestUser('betTest@alex.com', 'alex', 'password')
        token2 = await authTestUser('betTest2@alex.com', 'hugo', '123456')
        token3 = await authTestUser('creatorTest@alex.com', 'creator', 'password78')
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

    describe('PATCH /bets/:id/votes', () => {
        let pointsBetId = 0
        beforeAll(async () => {
            pointsBetId = await createBet(token1)
            await createVote(pointsBetId, token2, "success")
            await createVote(pointsBetId, token3, "fail")
        })
        it('attribue les points correctement à la clôture', async () => {
            await supertest(app).patch('/api/bets/' + pointsBetId).set("Authorization", 'Bearer ' + token1).send({
                status: 'success'
            }).expect(200)
            const user = await prisma.user.findUnique({ where: { email: 'betTest@alex.com' } })
            expect(user?.points).toBe(5)
            const user2 = await prisma.user.findUnique({ where: { email: 'betTest2@alex.com' } })
            expect(user2?.points).toBe(10)
            const creatorPoints = await prisma.user.findUnique({ where: { email: 'creatorTest@alex.com' } })
            expect(creatorPoints?.points).toBe(0)
            const bet = await prisma.bet.findUnique({ where: { id: pointsBetId } })
            expect(bet?.status).toBe('success')
        })
    })

    describe('DELETE /bets/:id', () => {
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


