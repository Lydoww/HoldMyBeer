import { Request, Response } from 'express'
import prisma from '../lib/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/AppError.js'

export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    const emailAlreadyUsed = await prisma.user.findUnique({
        where: { email }
    })
    if (emailAlreadyUsed) {
        throw new BadRequestError('Email already in use')
    }
    const hash = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password: hash
        },
        omit: {
            password: true
        }
    })
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.SECRET_KEY as string, { expiresIn: '1h' })
    res.status(201).json({ token, user: newUser })
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user) {
        throw new UnauthorizedError('Invalid email or password')
    }
    const comparedPwd = await bcrypt.compare(password, user.password)
    if (!comparedPwd) {
        throw new UnauthorizedError('Invalid email or password')
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY as string, { expiresIn: '1h' })
    return res.status(200).json({
        token, user: {
            id: user.id,
            email: user.email,
            username: user.username,
            points: user.points
        }
    })
}

export const me = async (req: Request, res: Response) => {
    const userId = req.user.userId

    const user = await prisma.user.findUnique({
        where: { id: userId },
        omit: {
            password: true
        }
    })
    if (!user) {
        throw new NotFoundError('User not found')
    }
    return res.json(user)
}