'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import { AuthResponse, UserInfo } from '@/lib/types'

interface AuthContextType {
  user: UserInfo | null
  isLoggedIn: boolean
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    const raw = localStorage.getItem('user_info')
    if (token && raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_info')
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return
    const publicPaths = ['/login', '/register']
    const isPublic = publicPaths.some(p => pathname.startsWith(p))

    if (!user && !isPublic) {
      router.push('/login')
    } else if (user && isPublic) {
      router.push('/dashboard')
    }
  }, [user, loading, pathname, router])

  const login = useCallback(async (email: string, senha: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, senha })
    localStorage.setItem('jwt_token', res.token)
    localStorage.setItem('user_info', JSON.stringify({ nome: res.nome, email: res.email }))
    setUser({ nome: res.nome, email: res.email })
    router.push('/dashboard')
  }, [router])

  const register = useCallback(async (nome: string, email: string, senha: string) => {
    const res = await api.post<AuthResponse>('/auth/register', { nome, email, senha })
    localStorage.setItem('jwt_token', res.token)
    localStorage.setItem('user_info', JSON.stringify({ nome: res.nome, email: res.email }))
    setUser({ nome: res.nome, email: res.email })
    router.push('/dashboard')
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_info')
    setUser(null)
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
