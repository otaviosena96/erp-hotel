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

  return { guests, loading, loadGuests }
}
