import { API_CONFIG, createApiUrl } from '../config/api'

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

const handleAuthError = (status: number) => {
  if (status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

export const api = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    }

    const response = await fetch(createApiUrl(endpoint), {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      handleAuthError(response.status)
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || 'Request failed', response.status)
    }

    return response.json()
  },

  async get<T>(endpoint: string): Promise<T> {
    const headers = getAuthHeaders()

    const response = await fetch(createApiUrl(endpoint), {
      headers,
    })

    if (!response.ok) {
      handleAuthError(response.status)
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || 'Request failed', response.status)
    }

    return response.json()
  },
}
