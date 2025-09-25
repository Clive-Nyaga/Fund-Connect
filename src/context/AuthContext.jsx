import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
const STORAGE_USER = 'fundconnect_user'
const STORAGE_TOKEN = 'fundconnect_token'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_USER)
    const savedToken = localStorage.getItem(STORAGE_TOKEN)

    if (savedToken) setAuthHeader(savedToken)

    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setLoading(false)
      return
    }

    const check = async () => {
      if (!savedToken) {
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(`${API_URL}/check`)
        setUser(res.data)
        localStorage.setItem(STORAGE_USER, JSON.stringify(res.data))
      } catch (err) {
        console.warn('Session invalid or expired', err)
        localStorage.removeItem(STORAGE_TOKEN)
        localStorage.removeItem(STORAGE_USER)
        setAuthHeader(null)
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [])

  const login = async (credentials) => {
    // credentials: { email, password }
    try {
      const res = await axios.post(`${API_URL}/login`, credentials)
      const token = res.data.token
      const userData = res.data.user
      localStorage.setItem(STORAGE_TOKEN, token)
      localStorage.setItem(STORAGE_USER, JSON.stringify(userData))
      setAuthHeader(token)
      setUser(userData)
      return userData
    } catch (err) {
      console.error('Login failed', err.response?.data || err.message)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN)
    localStorage.removeItem(STORAGE_USER)
    setAuthHeader(null)
    setUser(null)
  }

  const register = async (userData) => {
    // userData: { name, email, password, designation? }
    try {
      const res = await axios.post(`${API_URL}/users`, userData)
      // server returns token and user
      const token = res.data.token
      const newUser = res.data.user
      localStorage.setItem(STORAGE_TOKEN, token)
      localStorage.setItem(STORAGE_USER, JSON.stringify(newUser))
      setAuthHeader(token)
      setUser(newUser)
      return newUser
    } catch (err) {
      console.error('Registration failed', err.response?.data || err.message)
      throw err
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
