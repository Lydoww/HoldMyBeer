import type { CreateVotePayload, UpdateVotePayload, Vote } from "@/types"
import apiClient from "./interceptors"

export const getVotes = async (userId?: number, creatorId?: number): Promise<Vote[]> => {
    const response = await apiClient.get('/votes', { params: { userId, creatorId } })
    return response.data
}

export const createVote = async (betId: number, data: CreateVotePayload) => {
    const response = await apiClient.post(`/bets/${betId}/votes`, data)
    return response.data
}

export const updateVote = async (id: number, data: UpdateVotePayload) => {
    const response = await apiClient.patch(`/votes/${id}`, data)
    return response.data
}

export const deleteVote = async (id: number) => {
    await apiClient.delete(`/votes/${id}`)

}