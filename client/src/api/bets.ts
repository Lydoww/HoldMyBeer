import type { CreateBetPayload, PaginatedBetsResponse, UpdateBetPayload } from "@/types";
import apiClient from "./interceptors";

export const getBets = async (page: number, pageSize: number, creatorId?: number, excludeCreatorId?: number): Promise<PaginatedBetsResponse> => {
    const response = await apiClient.get('/bets', { params: { page, pageSize, creatorId, excludeCreatorId } })
    return response.data
}

export const createBet = async (data: CreateBetPayload) => {
    const response = await apiClient.post('/bets', data)
    return response.data
}

export const getOneBet = async (id: number) => {
    const response = await apiClient.get(`/bets/${id}`)
    return response.data
}

export const updateBet = async (id: number, data: UpdateBetPayload) => {
    const response = await apiClient.patch(`/bets/${id}`, data)
    return response.data
}

export const deleteBet = async (id: number) => {
    await apiClient.delete(`/bets/${id}`)

}