import type { BetStatus } from "@/types";
import apiClient from "./interceptors";

interface UpdateBetPayload {
    title?: string,
    description?: string,
    status?: BetStatus
}


export const getBets = async (page: number, pageSize: number) => {
    const response = await apiClient.get('/bets', { params: { page, pageSize } })
    return response.data
}

export const createBet = async (title: string, description: string) => {
    const response = await apiClient.post('/bets', { title, description })
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