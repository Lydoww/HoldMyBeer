import { useAuth } from '@/stores/authStore'
import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use((config) => {
    const token = useAuth.getState().token
    if (token) {
        config.headers = config.headers ?? {}
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
},
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use((response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    })

export default apiClient