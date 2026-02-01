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


export const cleanerFunction = async () => {
    await prisma.vote.deleteMany()
    await prisma.bet.deleteMany()
    await prisma.user.deleteMany()
}