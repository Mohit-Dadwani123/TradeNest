import api from './api'

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  }

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  async getCurrentUser() {
    const token = localStorage.getItem('token')
    if (!token) return null
    
    try {
      const response = await api.get('/auth/me')
      return response.data.user
    } catch (error) {
      this.logout()
      return null
    }
  }

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData)
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async changePassword(oldPassword, newPassword) {
    const response = await api.put('/auth/change-password', { oldPassword, newPassword })
    return response.data
  }

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  }

  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', { token, newPassword })
    return response.data
  }

  isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

export default new AuthService()