import { Request, Response } from "express"
import prisma from "../lib/db.js"
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors/AppError.js"

export const getVotes = async (req: Request, res: Response) => {
    const userId = req.query.userId

    const where = userId ? { userId: Number(userId) } : {}

    const data = await prisma.vote.findMany({ where, include: { bet: true } })
    res.json(data)
}

export const createVote = async (req: Request, res: Response) => {
    const { choice } = req.body
    const betId = Number(req.params.id)
    const userId = req.user.userId
    const bet = await prisma.bet.findUnique({
        where: { id: betId }
    })

    if (bet == null) {
        throw new NotFoundError('Bet does not exist')
    } else if (userId === bet.creatorId) {
        throw new BadRequestError('You can\'t vote for your own bet')
    } else {

        const newVote = await prisma.vote.create({
            data: {
                choice,
                userId,
                betId
            }
        })

        res.status(201).json(newVote)

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
        throw new NotFoundError('Vote not found')
    }
    if (user !== vote.userId) {
        throw new ForbiddenError('You cannot update someone else\'s vote')
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
        throw new NotFoundError('Vote not found')
    }

    if (user !== vote.userId) {
        throw new ForbiddenError('You cannot delete a vote you do not own')
    }

    await prisma.vote.delete({ where: { id } })
    res.status(200).json({ message: 'Vote deleted successfully' })
}