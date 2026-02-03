import { NextFunction, Request, Response } from "express";
import z from "zod";
import { ValidationError } from "../errors/AppError.js";

export const validateMiddleware = (schema: z.ZodType) => {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            throw new ValidationError('Validation failed')
        }
        next()
    }
}