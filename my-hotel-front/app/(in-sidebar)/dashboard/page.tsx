"use client"

import { createApiUrl } from '@/lib/config/api'

const handleAuthError = (status: number) => {
  if (status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

import { useEffect, useState } from "react"
import { Calendar, Hotel, Users, TrendingUp, BedDouble, DollarSign } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardStats {
  totalReservations: number
  totalHotels: number
  totalGuests: number
  occupancyRate: number
  monthlyRevenue: number
  averageStayDuration: number
}

interface RecentReservation {
  id: string
  hotelName: string
  responsibleName: string
  checkIn: string
  checkOut: string
  status: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    totalHotels: 0,
    totalGuests: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    averageStayDuration: 0
  })
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem('token')
      
      // Buscar todas as reservas
      const reservationsResponse = await fetch(createApiUrl('/reservation'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!reservationsResponse.ok) {
    handleAuthError(reservationsResponse.status)
    throw new Error('Falha ao buscar reservas')
}
      const reservations = await reservationsResponse.json()

      // Buscar todos os hotéis
      const hotelsResponse = await fetch(createApiUrl('/hotel'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!hotelsResponse.ok) {
        handleAuthError(hotelsResponse.status)
        throw new Error('Falha ao buscar hotéis')
      }
      const hotels = await hotelsResponse.json()

      // Calcular estatísticas
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      
      const currentMonthReservations = reservations.filter((res: any) => {
        const checkIn = new Date(res.checkIn)
        return checkIn.getMonth() === currentMonth && checkIn.getFullYear() === currentYear
      })

      const activeReservations = reservations.filter((res: any) => {
        const checkIn = new Date(res.checkIn)
        const checkOut = new Date(res.checkOut)
        return checkIn <= today && checkOut >= today
      })

      const totalRooms = hotels.reduce((sum: number, hotel: any) => sum + (hotel.roomQuantity || 0), 0)
      const occupancyRate = totalRooms > 0 ? (activeReservations.length / totalRooms) * 100 : 0

      // Calcular receita mensal (estimativa)
      const monthlyRevenue = currentMonthReservations.reduce((sum: number, res: any) => {
        const nights = Math.ceil((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24))
        return sum + (nights * 150) // estimativa de R$150 por noite
      }, 0)

      // Calcular duração média de estadia
      const totalNights = reservations.reduce((sum: number, res: any) => {
        const nights = Math.ceil((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24))
        return sum + nights
      }, 0)
      const averageStayDuration = reservations.length > 0 ? totalNights / reservations.length : 0

      setStats({
        totalReservations: reservations.length,
        totalHotels: hotels.length,
        totalGuests: reservations.length, // estimativa
        occupancyRate: Math.round(occupancyRate),
        monthlyRevenue,
        averageStayDuration: Math.round(averageStayDuration * 10) / 10
      })

      // Pegar as 5 reservas mais recentes
      const recent = reservations
        .sort((a: any, b: any) => new Date(b.createdAt || b.checkIn).getTime() - new Date(a.createdAt || a.checkIn).getTime())
        .slice(0, 5)
        .map((res: any) => ({
          id: res.id,
          hotelName: res.hotel?.name || `Hotel #${res.hotelId}`,
          responsibleName: res.responsibleName,
          checkIn: res.checkIn,
          checkOut: res.checkOut,
          status: new Date(res.checkIn) <= today && new Date(res.checkOut) >= today ? 'Ativa' : 
                  new Date(res.checkIn) > today ? 'Futura' : 'Finalizada'
        }))

      setRecentReservations(recent)
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de controle hoteleiro
            </p>
          </div>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

   const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
   }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle hoteleiro
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              Todas as reservas do sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotéis</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHotels}</div>
            <p className="text-xs text-muted-foreground">
              Hotéis cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Ocupação atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              Estimativa deste mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Estadia</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageStayDuration} noites</div>
            <p className="text-xs text-muted-foreground">
              Duração média por reserva
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hóspedes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">
              Total estimado de hóspedes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recentes</CardTitle>
          <CardDescription>
            Últimas reservas realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma reserva encontrada</p>
              </div>
            ) : (
              recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{reservation.hotelName}</p>
                    <p className="text-sm text-muted-foreground">{reservation.responsibleName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reservation.status === 'Ativa' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'Futura' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
