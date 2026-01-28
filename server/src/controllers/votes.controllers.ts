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
    try {
        const newVote = await prisma.vote.create({
            data: {
                choice,
                userId,
                betId
            }
        })
        res.status(201).json(newVote)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(400).json('Tu as déjà voté sur ce pari')
        } else {
            console.error(error)
            return res.status(500).json('Erreur serveur')
        }
    }
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
    return res.status(200).json('Vote supprimé avec succès')
}