import { useState, useEffect } from "react"
import { hotelService } from "@/lib/services/hotel-service"

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

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  const loadHotels = async () => {
    try {
      const data = await hotelService.getAll()
      setHotels(data as Hotel[])
    } catch (error) {
      console.error("Erro ao carregar hotéis:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotels()
  }, [])

  return { hotels, loading }
}
