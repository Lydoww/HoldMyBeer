import { Request, Response } from "express"
import prisma from "../lib/db.js"
import { ForbiddenError, NotFoundError } from "../errors/AppError.js"

export const getBets = async (req: Request, res: Response) => {
    const data = await prisma.bet.findMany()
    res.json(data)
}

export const createBet = async (req: Request, res: Response) => {
    const { title, description } = req.body

    const newObj = await prisma.bet.create({
        data: {
            title,
            description,
            creatorId: req.user.userId
        }
    }
    )
    res.status(201).json(newObj)
}

export const getOneBet = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const bet = await prisma.bet.findUnique({ where: { id } })
    if (bet == null) {
        throw new NotFoundError('Le pari n\'existe pas')
    }
    res.json(bet)
}

export const updateBet = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { title, description } = req.body

    const user = req.user.userId

    const bet = await prisma.bet.findUnique({
        where: { id }
    })
    if (!bet) {
        throw new NotFoundError('Ce pari n\'existe pas')
    }
    if (user !== bet.creatorId) {
        throw new ForbiddenError('Vous ne pouvez pas modifier un pari que vous n\'avez pas crée')
    }
    const updatedBet = await prisma.bet.update({
        where: {
            id
        },
        data: {
            title,
            description
        }
    })
    res.json(updatedBet)
}

export const deleteBet = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = req.user.userId
    const bet = await prisma.bet.findUnique({
        where: { id }
    })

    if (!bet) {
        throw new NotFoundError('Ce pari n\'existe pas')
    }
    if (user !== bet.creatorId) {
        throw new ForbiddenError('Vous ne pouvez pas supprimmer un pari que vous n\'avez pas crée')
    }

    await prisma.bet.delete({ where: { id } })
    res.status(200).json({ message: 'Pari supprimé avec succès' })
}

