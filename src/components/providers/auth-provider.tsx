'use client'

import { User } from '@supabase/supabase-js'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { supabaseClientSide as supabase } from '@/lib/supabase'

type AuthContextValue = {
  user: User | null
  loading: boolean
}

type AuthProviderProps = {
  children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextValue)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const contextValue = useMemo(
    (): AuthContextValue => ({ user, loading }),
    [loading, user]
  )

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)

  return context
}
