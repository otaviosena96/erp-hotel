import { useState, useEffect } from "react"
import { reservationService } from "@/lib/services/reservation-service"

interface Reservation {
  id: string
  hotelId: string
  hotelName?: string
  checkIn: string
  checkOut: string
  responsibleName: string
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const loadReservations = async () => {
    try {
      const data = await reservationService.getAll()
      setReservations(data as Reservation[])
    } catch (error) {
      console.error("Erro ao carregar reservas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  return { reservations, loading, loadReservations }
}
