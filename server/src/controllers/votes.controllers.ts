import { Request, Response } from "express"
import { Prisma } from '@prisma/client'
import prisma from "../lib/db.js"
import { ForbiddenError, NotFoundError } from "../errors/AppError.js"

export const getVotes = async (req: Request, res: Response) => {
    const data = await prisma.vote.findMany()
    res.json(data)
}

export const createVote = async (req: Request, res: Response) => {
    const { choice } = req.body
    const betId = Number(req.params.id)
    const userId = req.user.userId

    const newVote = await prisma.vote.create({
        data: {
            choice,
            userId,
            betId
        }
    })
    res.status(201).json(newVote)
}

export const updateVote = async (req: Request, res: Response) => {

    const { choice } = req.body
    const id = Number(req.params.id)
    const user = req.user.userId

    const vote = await prisma.vote.findUnique({
        where: { id }
    })
    if (!vote) {
        throw new NotFoundError('Ce vote n\'existe pas')
    }
    if (user !== vote.userId) {
        throw new ForbiddenError('vous ne pouvez pas modifier le vote de quelqu\'un d\'autre')
    }
    const updateVote = await prisma.vote.update({
        where: { id },
        data: {
            choice
        }
    }
    )
    res.status(200).json(updateVote)
}

export const deleteVote = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = req.user.userId
    const vote = await prisma.vote.findUnique({
        where: { id }
    })

    if (!vote) {
        throw new NotFoundError('ce vote n\'existe pas')
    }

    if (user !== vote.userId) {
        throw new ForbiddenError('vous ne pouvez pas delete un vote qui ne vous appartient pas')
    }

    await prisma.vote.delete({ where: { id } })
    res.status(204).json({ message: 'Vote supprimé avec succès' })
}