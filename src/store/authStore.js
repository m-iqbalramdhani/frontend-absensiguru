import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user:  null,
      token: null,

      // Set data setelah login berhasil
      setAuth: (user, token) => set({ user, token }),

      // Update data user (misal setelah edit profil)
      setUser: (user) => set({ user }),

      // Hapus data saat logout
      logout: () => set({ user: null, token: null }),

      // Cek apakah user sudah login
      isAuthenticated: () => {
        const state = useAuthStore.getState()
        return !!state.token
      },
      
      // Cek apakah sudah login
      isLoggedIn: () => {
        const state = useAuthStore.getState()
        return !!(state.token && state.user)
      },

    }),
    {
      name: 'smk-auth', // Key di localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

export default useAuthStore