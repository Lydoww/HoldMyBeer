import apiClient from "./interceptors"

export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
}

export const registerUser = async (email: string, username: string, password: string) => {
    const response = await apiClient.post('/auth/register', { email, username, password })
    return response.data
}