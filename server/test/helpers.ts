import supertest from "supertest"
import prisma from "../src/lib/db"
import app from "../src/app"

export const authTestUser = async (email: string, username: string, password: string) => {
    await supertest(app).post("/api/auth/register").send({
        email: email,
        username: username,
        password: password
    })

    const newRequest = await supertest(app).post("/api/auth/login").send({
        email: email,
        password: password
    })
    return newRequest.body.token
}

export const createBet = async (token: string) => {
    const response = await supertest(app).post('/api/bets').set('Authorization', 'Bearer ' + token).send({
        title: 'Pari pour les votes',
        description: 'un pari pour les votes'
    }).expect(201)
    return response.body.id
}

export const cleanerFunction = async () => {
    await prisma.vote.deleteMany()
    await prisma.bet.deleteMany()
    await prisma.user.deleteMany()
}