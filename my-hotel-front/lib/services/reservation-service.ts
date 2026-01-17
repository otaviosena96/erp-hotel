import { createApiUrl } from '../config/api'

export const reservationService = {
  async create(data: any) {
    const response = await fetch(createApiUrl('/reservation'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar reserva');
    }

    return response.json()
  },

  async getAll() {
    const response = await fetch(createApiUrl('/reservation'), {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Falha ao buscar reservas');
    }

    return response.json()
  }
}
