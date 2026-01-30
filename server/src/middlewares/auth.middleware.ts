import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    if (!header) {
        return res.status(401).json('header invalid')
    }
    const token = header && header.split(' ')[1]
    if (!token) {
        return res.status(401).json('token introuvable')
    }
    try {
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: number; email: string }
        req.user = verifyToken
        next()
    } catch (error) {
        return res.status(401).json('crédit invalide')
    }

}

export default authenticateToken