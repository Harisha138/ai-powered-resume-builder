"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, FileText, Download, Sparkles, Target, BarChart3, Zap, Award } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, isConnected } = useAuth()
  const router = useRouter()

  if (user) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold gradient-text">AI Resume Builder</span>
          </div>
          <div className="flex items-center space-x-4">
            {!isConnected && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Demo Mode
              </Badge>
            )}
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button className="gradient-bg">Get Started Free</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Resume Builder with ATS Scoring
            </Badge>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Build Your Perfect Resume with <span className="gradient-text">AI Power & ATS Scoring</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Create professional, ATS-optimized resumes in minutes. Our AI analyzes your experience, suggests
            improvements, and provides real-time ATS scoring to help you land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-4 gradient-bg">
                Start Building Now - Free
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              View Sample Resume
              <FileText className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle className="text-xl">Real-Time ATS Scoring</CardTitle>
              <CardDescription className="text-base">
                Get instant feedback on your resume's ATS compatibility with detailed scoring and optimization
                suggestions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle className="text-xl">AI-Powered Content</CardTitle>
              <CardDescription className="text-base">
                Let AI help you write compelling bullet points, professional summaries, and optimize your resume content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle className="text-xl">Performance Analytics</CardTitle>
              <CardDescription className="text-base">
                Track your resume's performance with detailed analytics and insights to improve your job search success
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <FileText className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle className="text-xl">Professional Templates</CardTitle>
              <CardDescription className="text-base">
                Choose from multiple professionally designed templates that pass ATS systems and impress recruiters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle className="text-xl">Instant Optimization</CardTitle>
              <CardDescription className="text-base">
                Get real-time suggestions for keywords, formatting, and content to maximize your resume's impact
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <Download className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle className="text-xl">Export & Share</CardTitle>
              <CardDescription className="text-base">
                Download your resume as a high-quality PDF or share it online with a professional URL
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white/60 backdrop-blur rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Resumes Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2x</div>
              <div className="text-gray-600">More Interviews</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Input Your Information</h3>
              <p className="text-gray-600">Add your work experience, education, and skills using our intuitive form</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Optimization</h3>
              <p className="text-gray-600">Our AI analyzes and optimizes your content for maximum ATS compatibility</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download & Apply</h3>
              <p className="text-gray-600">Get your ATS-optimized resume and start applying with confidence</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Trusted by Job Seekers Worldwide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4">
                "The ATS scoring feature helped me understand exactly what recruiters were looking for. Got 3 interviews
                in the first week!"
              </p>
              <div className="font-semibold">Sarah Chen, Software Engineer</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4">
                "The AI suggestions transformed my resume. My ATS score went from 45% to 92% and I landed my dream job!"
              </p>
              <div className="font-semibold">Marcus Johnson, Marketing Manager</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4">
                "Simple, powerful, and effective. The real-time feedback made all the difference in my job search."
              </p>
              <div className="font-semibold">Emily Rodriguez, Data Analyst</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Build Your Perfect Resume?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of job seekers who've improved their ATS scores and landed their dream jobs
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-12 py-4 gradient-bg">
              Get Started Free Today
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever plan available</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6" />
                <span className="text-lg font-bold">AI Resume Builder</span>
              </div>
              <p className="text-gray-400">
                Create professional, ATS-optimized resumes with AI assistance and real-time scoring.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Resume Builder
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    ATS Scoring
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    AI Assistant
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    ATS Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Career Advice
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
