import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

const errorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message })
    } else {
        return res.status(500).json({ message: 'Problème survenu au niveau du serveur' })
    }
}

export default errorMiddleware