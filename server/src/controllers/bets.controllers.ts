import { Request, Response } from "express"
import prisma from "../lib/db.js"
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors/AppError.js"

export const getBets = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const skip = (page - 1) * pageSize
    const take = pageSize

    const promise1 = prisma.bet.findMany({
        skip,
        take,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            creator: {
                select: {
                    username: true
                }
            },
            _count: {
                select: {
                    votes: true
                }
            }
        }
    })

    const promise2 = prisma.bet.count()

    const [data, totalBets] = await Promise.all([promise1, promise2])

    res.json({
        data,
        page,
        pageSize,
        total: totalBets,
        totalPages: Math.ceil(totalBets / pageSize)
    })
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
    const { title, description, status } = req.body

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

    if (bet.status !== 'open' && status) {
        throw new BadRequestError('Ce pari est déjà clôturé')
    }

    if (bet.status === 'open' && (status === 'success' || status === 'failed')) {
        const result = await prisma.$transaction(async (tx) => {

            const changeBetStatus = await tx.bet.update({
                where: {
                    id
                },
                data: {
                    status
                }
            })
            const allVotes = await tx.vote.findMany({ where: { betId: id } })

            const updatePromises = allVotes.map((vote) => {
                if ((status === 'success' && vote.choice === 'success') || (status === 'failed' && vote.choice === 'fail')) {
                    const updateUserPoints = tx.user.update(
                        {
                            where: { id: vote.userId },
                            data: {
                                points: { increment: 10 }
                            }
                        }
                    )
                    return updateUserPoints

                }
            })
            await Promise.all(updatePromises.filter(Boolean))
            await tx.user.update({
                where: { id: bet.creatorId },
                data: { points: { increment: 5 } }
            })
            return changeBetStatus
        })
        res.json(result)

    } else {
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
        throw new ForbiddenError('Vous ne pouvez pas supprimer un pari que vous n\'avez pas crée')
    }

    await prisma.bet.delete({ where: { id } })
    res.status(200).json({ message: 'Pari supprimé avec succès' })
}

