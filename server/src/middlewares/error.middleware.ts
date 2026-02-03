import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { Prisma } from "@prisma/client";

const errorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message })
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: 'Unique constraint violation: ' + err.meta?.target })
        } else if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Resource not found: ' + err.meta?.target })
        }
    }
    else {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export default errorMiddleware