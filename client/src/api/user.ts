import type { User } from "@/types";
import apiClient from "./interceptors";

export const leaderboard = async (): Promise<User[]> => {
    const response = await apiClient.get('/leaderboard')
    return response.data
}