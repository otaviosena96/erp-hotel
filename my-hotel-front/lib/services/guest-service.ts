import { createApiUrl } from '../config/api'

const handleAuthError = (status: number) => {
  if (status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

export const guestService = {
  async create(data: any) {
    const response = await fetch(createApiUrl('/guests'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      handleAuthError(response.status)
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar hóspede');
    }

    return response.json()
  },

  async findByReservation(reservationId: string) {
    const response = await fetch(createApiUrl(`/guests/reservation/${reservationId}`), {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      handleAuthError(response.status)
      throw new Error('Falha ao buscar hóspedes');
    }

    return response.json()
  }
}
