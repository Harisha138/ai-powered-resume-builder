const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Important for session cookies
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name: string, email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  // Resume endpoints
  async getResumes() {
    return this.request("/resumes")
  }

  async getResume(id: string) {
    return this.request(`/resumes/${id}`)
  }

  async createResume(resumeData: any) {
    return this.request("/resumes", {
      method: "POST",
      body: JSON.stringify(resumeData),
    })
  }

  async updateResume(id: string, resumeData: any) {
    return this.request(`/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(resumeData),
    })
  }

  async deleteResume(id: string) {
    return this.request(`/resumes/${id}`, {
      method: "DELETE",
    })
  }

  // AI endpoints
  async generateSummary(data: any) {
    return this.request("/ai/generate-summary", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async improveDescription(data: any) {
    return this.request("/ai/improve-description", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async suggestSkills(data: any) {
    return this.request("/ai/suggest-skills", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Health check
  async healthCheck() {
    return this.request("/health")
  }
}

export const apiClient = new ApiClient()
