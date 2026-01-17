import { useState, useEffect } from "react"
import { reservationService } from "@/lib/services/reservation-service"

interface Hotel {
  id: string
  code: number
  name: string
  city: string
  roomQuantity: number
  stars: number
  createdAt: string
  updatedAt: string
}

interface Reservation {
  id: string
  hotelId: string
  hotel: Hotel
  checkIn: string
  checkOut: string
  responsibleName: string
  createdAt: string
  updatedAt: string
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
