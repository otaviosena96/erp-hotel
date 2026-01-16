const API_BASE_URL = 'http://localhost:3033'

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export const api = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || 'Request failed', response.status)
    }

    return response.json()
  },

  async get<T>(endpoint: string): Promise<T> {
    const headers = getAuthHeaders()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || 'Request failed', response.status)
    }

    return response.json()
  },
}
