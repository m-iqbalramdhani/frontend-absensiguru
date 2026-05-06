import api from './api'

const authService = {

  // Login — kirim email + password, terima token + user
  login: async ({ email, password }) => {
    const res = await api.post('/api/auth/login', { email, password })
    return res.data // { message, token, user: { id, name, email, role } }
  },

  // Get profil user yang sedang login
  getMe: async () => {
    const res = await api.get('/api/auth/me')
    return res.data // { data: { id, name, email, role } }
  },

}

export default authService