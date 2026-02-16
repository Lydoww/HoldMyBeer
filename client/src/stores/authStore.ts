import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface User {
    id: number
    email: string
    username: string
    points: number
}

interface AuthState {
    token: string | null
    user: User | null
    setAuth: (token: string, user: User) => void
    logout: () => void
    updatePoints: (newPoints: number) => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
            updatePoints: (newPoints) => set((prev) =>
                prev.user ?
                    ({ user: { ...prev.user, points: newPoints } }) : {})
        }),

        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)