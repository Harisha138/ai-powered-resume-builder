"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  picture?: string
  subscription?: string
  aiCreditsUsed?: number
  aiCreditsLimit?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isConnected: boolean
  handleGoogleLogin: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health", {
        credentials: "include",
        mode: "cors",
      })
      if (response.ok) {
        setIsConnected(true)

        // Check if user is logged in
        const userResponse = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
          mode: "cors",
        })
        if (userResponse.ok) {
          const data = await userResponse.json()
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error("Backend connection failed:", error)
      setIsConnected(false)

      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      if (isConnected) {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Login failed")
        }

        const data = await response.json()
        setUser(data.user)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(data.user))
        }
      } else {
        // Mock login
        const mockUser = {
          id: "1",
          name: email.split("@")[0],
          email: email,
          subscription: "free",
          aiCreditsUsed: 5,
          aiCreditsLimit: 50,
        }
        setUser(mockUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(mockUser))
        }
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      if (isConnected) {
        // Validate inputs before sending
        if (!name || name.trim().length < 2) {
          throw new Error("Name must be at least 2 characters long")
        }
        if (!email || !email.includes("@")) {
          throw new Error("Please provide a valid email address")
        }
        if (!password || password.length < 8) {
          throw new Error("Password must be at least 8 characters long")
        }

        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Registration failed")
        }

        const data = await response.json()
        setUser(data.user)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(data.user))
        }
      } else {
        // Mock registration
        const mockUser = {
          id: "1",
          name: name,
          email: email,
          subscription: "free",
          aiCreditsUsed: 0,
          aiCreditsLimit: 50,
        }
        setUser(mockUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(mockUser))
        }
      }
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (isConnected) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          credentials: "include",
          mode: "cors",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }
    }
  }

  const handleGoogleLogin = async () => {
    if (isConnected) {
      // For connected mode, redirect to Google OAuth
      window.location.href = "http://localhost:5000/api/auth/google"
    } else {
      // For demo mode, simulate Google login
      setIsLoading(true)
      setTimeout(() => {
        try {
          const mockUser = {
            id: "google_demo_user",
            name: "Demo User",
            email: "demo@gmail.com",
            picture: "https://via.placeholder.com/40",
            subscription: "free",
            aiCreditsUsed: 2,
            aiCreditsLimit: 50,
          }
          setUser(mockUser)
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(mockUser))
          }
          toast({
            title: "Welcome!",
            description: "Successfully signed in with Google (Demo Mode).",
          })
          router.push("/dashboard")
        } catch (error: any) {
          setError("Failed to sign in with Google")
          toast({
            title: "Error",
            description: "Failed to sign in with Google.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }, 1500)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isConnected, handleGoogleLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
