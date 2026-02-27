import { Request, Response } from "express";
import prisma from "../lib/db.js";

export const leaderBoard = async (req: Request, res: Response) => {
    const getBestUsers = await prisma.user.findMany({
        take: 10,
        orderBy: {
            points: 'desc'
        },
        omit: {
            password: true
        }
    })

    return res.json(getBestUsers)
}