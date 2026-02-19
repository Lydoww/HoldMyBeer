import { Request, Response } from "express"
import prisma from "../lib/db.js"
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors/AppError.js"
import cloudinary from "../lib/cloudinary.js"

export const getBets = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const skip = (page - 1) * pageSize
    const take = pageSize
    const creatorId = req.query.creatorId
    const excludeCreatorId = req.query.excludeCreatorId

    const where = creatorId ? { creatorId: Number(creatorId) } : {}
    const whereCreatorIsExclude = excludeCreatorId ? { creatorId: { not: Number(excludeCreatorId) } } : {}



    const promise1 = prisma.bet.findMany({
        skip,
        take,
        where: { ...where, ...whereCreatorIsExclude },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            creator: {
                select: {
                    username: true,

                }
            },
            votes: true,
            _count: {
                select: {
                    votes: true
                }
            },

        }
    })

    const promise2 = prisma.bet.count({ where })

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
    let imageURL;

    if (req.file) {
        const convert = req.file.buffer.toString('base64')
        const dataURI = `data:${req.file.mimetype};base64,${convert}`
        const response = await cloudinary.uploader.upload(dataURI)
        imageURL = response.secure_url
    }

    const newObj = await prisma.bet.create({
        data: {
            title,
            description,
            imageURL,
            creatorId: req.user.userId
        }
    }
    )
    res.status(201).json(newObj)
}

export const getOneBet = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const bet = await prisma.bet.findUnique({
        where: { id },
        include: {
            creator: {
                select: {
                    username: true,

                }
            },
            votes: true,
            _count: {
                select: {
                    votes: true
                }
            },

        }
    })
    if (bet == null) {
        throw new NotFoundError('Bet not found')
    }
    res.json(bet)
}

export const updateBet = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { title, description, status } = req.body

    const user = req.user.userId

    const bet = await prisma.bet.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    votes: true
                }
            }
        },
    })
    if (!bet) {
        throw new NotFoundError('Bet not found')
    }
    if (user !== bet.creatorId) {
        throw new ForbiddenError('You cannot update a bet you did not create')
    }

    if (bet.status !== 'open') {
        throw new BadRequestError('This bet is already closed')
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
            const updatedCreator = await tx.user.update({
                where: { id: bet.creatorId },
                data: { points: { increment: 5 } }
            })
            return { changeBetStatus, updatedCreator }
        })
        res.json(result)

    } else {
        if (bet._count.votes > 0) {
            throw new BadRequestError('You can\'t update your bet if there is votes on it')
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

}

export const deleteBet = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = req.user.userId
    const bet = await prisma.bet.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    votes: true
                }
            }
        }
    })

    if (!bet) {
        throw new NotFoundError('Bet not found')
    }
    if (user !== bet.creatorId) {
        throw new ForbiddenError('You cannot delete a bet you did not create')
    }

    if (bet.status !== 'open') {
        throw new BadRequestError('You can\'t delete a bet with a status success or failed')
    }

    if (bet._count.votes > 0) {
        throw new BadRequestError('You can\'t delete your bet if there is votes on it')
    }
    await prisma.bet.delete({ where: { id } })
    res.status(200).json({ message: 'Bet deleted successfully' })

}

