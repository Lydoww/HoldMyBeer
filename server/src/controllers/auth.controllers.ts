import { Request, Response } from 'express'
import prisma from '../lib/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { BadRequestError, UnauthorizedError } from '../errors/AppError.js'

export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    const emailAlreadyUsed = await prisma.user.findUnique({
        where: { email }
    })
    if (emailAlreadyUsed) {
        throw new BadRequestError('Email déjà utilisé')
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
    res.status(201).json(newUser)
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user) {
        throw new UnauthorizedError('Email ou mot de passe incorrect')
    }
    const comparedPwd = await bcrypt.compare(password, user.password)
    if (!comparedPwd) {
        throw new UnauthorizedError('Email ou mot de passe incorrect')
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY as string, { expiresIn: '1h' })
    return res.status(200).json(token)
}