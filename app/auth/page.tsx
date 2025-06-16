"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Mail, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, register, isConnected } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check for OAuth errors in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const oauthError = urlParams.get("error")
    if (oauthError) {
      setError("Google sign-in failed. Please try again.")
      toast({
        title: "Sign-in Failed",
        description: "There was an issue with Google sign-in. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (isConnected) {
        // Redirect to Google OAuth
        window.location.href = "http://localhost:5000/api/auth/google"
      } else {
        // Demo mode simulation
        setTimeout(async () => {
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

            // Simulate the login process
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Set user in auth context (this will be handled by the auth provider)
            localStorage.setItem("user", JSON.stringify(mockUser))

            toast({
              title: "Welcome!",
              description: "Successfully signed in with Google (Demo Mode).",
            })

            // Redirect to dashboard
            router.push("/dashboard")
          } catch (error: any) {
            setError("Demo sign-in failed")
            toast({
              title: "Error",
              description: "Demo sign-in failed. Please try again.",
              variant: "destructive",
            })
          } finally {
            setIsLoading(false)
          }
        }, 500)
      }
    } catch (error) {
      setError("Failed to initiate Google sign-in")
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>, isSignUp: boolean) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = (formData.get("name") as string) || email.split("@")[0]

    try {
      if (isSignUp) {
        await register(name, email, password)
        toast({
          title: "Account Created!",
          description: isConnected ? "Successfully registered." : "Account created (Demo Mode).",
        })
      } else {
        await login(email, password)
        toast({
          title: "Welcome Back!",
          description: isConnected ? "Successfully signed in." : "Signed in (Demo Mode).",
        })
      }
      router.push("/dashboard")
    } catch (error: any) {
      const errorMessage = error.message || "Authentication failed"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl gradient-text">Welcome to AI Resume Builder</CardTitle>
          <CardDescription className="text-base">
            Sign in to start building your perfect resume with ATS scoring
          </CardDescription>
          {!isConnected && (
            <div className="mt-2">
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Demo Mode - Backend Offline
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button onClick={handleGoogleLogin} disabled={isLoading} className="w-full mb-6 h-12" variant="outline">
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={(e) => handleEmailAuth(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => handleEmailAuth(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                    minLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password (min 8 characters)"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500">
                    Password must contain at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-gray-500 mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
