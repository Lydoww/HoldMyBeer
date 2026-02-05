export type BetStatus = 'open' | 'success' | 'failed'

export interface CreateBetPayload {
    title: string,
    description: string
}

export interface UpdateBetPayload {
    title?: string,
    description?: string,
    status?: BetStatus
}

export interface Bet {
    id: number,
    title: string,
    description: string,
    status: BetStatus
    creatorId: number
    creator: { username: string }
    _count: { votes: number }
}

export interface PaginatedBetsResponse {
    data: Bet[],
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
}