import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const STORAGE_USER = 'fundconnect_user'
const STORAGE_TOKEN = 'fundconnect_token'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_USER)
    const savedToken = localStorage.getItem(STORAGE_TOKEN)

    if (savedUser && savedToken) {
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
        const res = await authAPI.checkSession()
        setUser(res.data)
        localStorage.setItem(STORAGE_USER, JSON.stringify(res.data))
      } catch (err) {
        console.warn('Session invalid or expired', err)
        localStorage.removeItem(STORAGE_TOKEN)
        localStorage.removeItem(STORAGE_USER)
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [])

  const login = async (credentials) => {
    // credentials: { name, password }
    try {
      const res = await authAPI.login(credentials)
      const token = res.data.token
      const userData = res.data.user
      localStorage.setItem(STORAGE_TOKEN, token)
      localStorage.setItem(STORAGE_USER, JSON.stringify(userData))
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
    setUser(null)
  }

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData)
      const res = await authAPI.register(userData)
      console.log('Registration response:', res)
      if (res.data.message === 'User created successfully') {
        return await login({ name: userData.name, password: userData.password })
      }
      throw new Error('Registration failed')
    } catch (err) {
      console.error('Registration error details:', err)
      throw new Error(err.message || 'Registration failed')
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
