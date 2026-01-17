import { useState, useEffect } from "react"
import { guestService } from "@/lib/services/guest-service"

interface Guest {
  id: string
  guestName: string
  document: string
  documentType: 'CPF' | 'PASSPORT'
  reservationId: string
  createdAt: string
  updatedAt: string
}

export function useGuests(reservationId: string) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  const loadGuests = async () => {
    if (!reservationId) return
    
    try {
      setLoading(true)
      setGuests([])
      
      const data = await guestService.findByReservation(reservationId)
      setGuests(data as Guest[])
    } catch (error) {
      console.error("Erro ao carregar hóspedes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [reservationId])

  // Limpa dados quando reservationId for vazio
  useEffect(() => {
    if (!reservationId) {
      setGuests([])
      setLoading(false)
    }
  }, [reservationId])

  return { guests, loading, loadGuests }
}
