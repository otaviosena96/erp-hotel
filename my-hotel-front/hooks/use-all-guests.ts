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

export function useAllGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  const loadGuests = async (filters?: any) => {
    try {
      const data = await guestService.getAll(filters)
      setGuests(data as Guest[])
    } catch (error) {
      console.error("Erro ao carregar hóspedes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [])

  return { guests, loading, loadGuests }
}
