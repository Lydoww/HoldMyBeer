import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { Prisma } from "@prisma/client";

const errorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message })
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: 'Contrainte unique non respectée: ' + err.meta?.target })
        } else if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Ressource non trouvée: ' + err.meta?.target })
        }
    }
    else {
        return res.status(500).json({ message: 'Problème survenu au niveau du serveur' })
    }
}

export default errorMiddleware