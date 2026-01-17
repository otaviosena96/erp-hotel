const API_BASE_URL = 'http://localhost:3033'

export const guestService = {
  async create(data: any) {
    const response = await fetch(`${API_BASE_URL}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar hóspede');
    }

    return response.json()
  },

  async findByReservation(reservationId: string) {
    const response = await fetch(`${API_BASE_URL}/guests/reservation/${reservationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Falha ao buscar hóspedes');
    }

    return response.json()
  }
}
