export type BetStatus = 'open' | 'success' | 'failed'
export type Choice = 'success' | 'fail'

export interface CreateBetPayload {
    title: string,
    description: string
}

export interface CreateVotePayload {
    choice: Choice,
}

export interface UpdateBetPayload {
    title?: string,
    description?: string,
    status?: BetStatus
}

export interface UpdateVotePayload {
    choice?: Choice,
}

export interface Bet {
    id: number,
    title: string,
    description: string,
    status: BetStatus
    creatorId: number
    creator: { username: string }
    _count: { votes: number }
    votes: Vote[]
    createdAt: string
}

export interface PaginatedBetsResponse {
    data: Bet[],
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
}

export interface Vote {
    id: number,
    choice: Choice,
    userId: number,
    bet: Bet
    betId: number
}