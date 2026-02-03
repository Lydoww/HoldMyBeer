import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../errors/AppError.js'

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    if (!header) {
        throw new UnauthorizedError('Missing authorization header')
    }
    const token = header && header.split(' ')[1]
    if (!token) {
        throw new UnauthorizedError('Token not found')
    }
    try {
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: number; email: string }
        req.user = verifyToken
        next()
    } catch (error) {
        throw new UnauthorizedError('Invalid token')
    }

}

export default authenticateToken