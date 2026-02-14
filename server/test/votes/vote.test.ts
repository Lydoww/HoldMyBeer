import supertest from 'supertest';
import app from '../../src/app';
import { afterAll, beforeAll, describe, it } from 'vitest'
import { authTestUser, cleanerFunction } from '../helpers';

describe('Test des routes /votes', () => {
    let token1 = ''
    let token2 = ''
    let voteId = 0
    let betId = 0
    beforeAll(async () => {
        await cleanerFunction()
        token1 = await authTestUser('voteTest@alex.com', 'alex', 'password')
        token2 = await authTestUser('voteTest2@alex.com', 'hugo', '123456')

        const response = await supertest(app).post('/api/bets').set('Authorization', 'Bearer ' + token1).send({
            title: 'Pari pour les votes',
            description: 'un pari pour les votes'
        }).expect(201)
        betId = response.body.id
    })
    describe('GET /votes', () => {
        it('On récupérer tous les votes', async () => {
            await supertest(app).get('/api/votes').set('Authorization', 'Bearer ' + token1).expect(200)
        })
        it('On essaye de récupérer les votes sans token', async () => {
            await supertest(app).get('/api/votes').expect(401)
        })
    })
    describe('POST /votes', () => {
        it('On créer un vote', async () => {
            const response = await supertest(app).post('/api/bets/' + betId + '/votes').set('Authorization', 'Bearer ' + token2).send({
                choice: 'success'
            }).expect(201)
            voteId = response.body.id
        })
        it('Voter sans token', async () => {
            await supertest(app).post('/api/bets/' + betId + '/votes').send({
                choice: 'success'
            }).expect(401)
        })
        it('Vote avec un choix invalide', async () => {
            await supertest(app).post('/api/bets/' + betId + '/votes').set('Authorization', 'Bearer ' + token2).send({
                choice: 'maybe'
            }).expect(400)
        })
        it('Vote avec 2 fois sur meme pari', async () => {
            await supertest(app).post('/api/bets/' + betId + '/votes').set('Authorization', 'Bearer ' + token2).send({
                choice: 'success'
            }).expect(409)
        })
    })
    describe('PATCH /votes', () => {
        it('modifier un vote', async () => {
            await supertest(app).patch('/api/votes/' + voteId).set('Authorization', 'Bearer ' + token2).send({
                choice: 'fail'
            }).expect(200)
        })
        it('modifier un vote sans token', async () => {
            await supertest(app).patch('/api/votes/' + voteId).send({
                choice: 'fail'
            }).expect(401)
        })
        it('modifier le vote d\'un autre user', async () => {
            await supertest(app).patch('/api/votes/' + voteId).set('Authorization', 'Bearer ' + token1).send({
                choice: 'fail'
            }).expect(403)
        })
        it('modifier un vote inexistant', async () => {
            await supertest(app).patch('/api/votes/9999').set('Authorization', 'Bearer ' + token1).send({
                choice: 'fail'
            }).expect(404)
        })
    })
    describe('DELETE /votes', () => {
        it('Supprimer le vote d\'un autre user', async () => {
            await supertest(app).delete('/api/votes/' + voteId).set('Authorization', 'Bearer ' + token1).expect(403)
        })
        it('Supprimer un vote inexistant', async () => {
            await supertest(app).delete('/api/votes/999').set('Authorization', 'Bearer ' + token1).expect(404)
        })
        it('Supprimer un vote sans token', async () => {
            await supertest(app).delete('/api/votes/' + voteId).expect(401)
        })
        it('Supprimer un vote', async () => {
            await supertest(app).delete('/api/votes/' + voteId).set('Authorization', 'Bearer ' + token2).expect(200)
        })
    })
    afterAll(async () => {
        await cleanerFunction()
    })
})