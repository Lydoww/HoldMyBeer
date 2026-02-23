import type { Bet, CreateBetPayload, CursorBetsResponse, PaginatedBetsResponse, UpdateBetPayload } from "@/types";
import apiClient from "./interceptors";

export const getBets = async (page: number, pageSize: number, creatorId?: number, excludeCreatorId?: number): Promise<PaginatedBetsResponse> => {
    const response = await apiClient.get('/bets', { params: { page, pageSize, creatorId, excludeCreatorId } })
    return response.data
}

export const getBetsCursor = async (excludeCreatorId?: number, cursorId?: number): Promise<CursorBetsResponse> => {
    const response = await apiClient.get('/bets/cursor', {
        params: {
            excludeCreatorId, cursorId
        }
    })
    return response.data
}

export const createBet = async (data: CreateBetPayload) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.image) {
        formData.append('image', data.image);
    }
    const response = await apiClient.post('/bets', formData)
    return response.data
}

export const getOneBet = async (id: number): Promise<Bet> => {
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