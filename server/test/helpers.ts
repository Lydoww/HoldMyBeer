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

export const createVote = async (betId: number, token: string, choice: string) => {
    const response = await supertest(app).post('/api/bets/' + betId + '/votes').set('Authorization', 'Bearer ' + token).send({
        choice
    }).expect(201)
    return response.body
}


export const cleanerAuthFunction = async () => {
    await prisma.user.deleteMany({
        where: {
            email: 'authTest@test.com'
        }
    })
}

export const cleanerBetUser = async () => {
    await prisma.bet.deleteMany({
        where: {
            creator: {
                email: {
                    in: ['betTest@alex.com',
                        'betTest2@alex.com',
                        'creatorTest@alex.com']
                }
            }
        }
    })
    await prisma.user.deleteMany({
        where: {
            email: {
                in: ['betTest@alex.com',
                    'betTest2@alex.com',
                    'creatorTest@alex.com']
            }

        }
    })
}

export const cleanerVoteUser = async () => {
    await prisma.vote.deleteMany({
        where: {
            user: {
                email: {
                    in: ['voteTest@alex.com', 'voteTest2@alex.com']
                }
            }
        }
    })
    await prisma.bet.deleteMany({
        where: {
            creator: {
                email: {
                    in: ['voteTest@alex.com', 'voteTest2@alex.com']
                }
            }
        }
    })
    await prisma.user.deleteMany({
        where: {
            email: {
                in: ['voteTest@alex.com', 'voteTest2@alex.com']
            }

        }
    })
}