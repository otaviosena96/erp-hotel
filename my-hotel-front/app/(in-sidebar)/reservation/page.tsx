"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const AddReservationForm = dynamic(() => import("@/components/add-reservation-form"), {
  ssr: false
})

const GuestModal = dynamic(() => import("@/components/modals/guest-modal"), {
  ssr: false
})

import { useReservations } from "@/hooks/use-reservations"
import { useHotels } from "@/hooks/use-hotels"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReservationPage() {
  const { reservations, loading, loadReservations } = useReservations()
  const { hotels } = useHotels()
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    checkInFrom: '',
    checkInTo: '',
    hotelId: '',
    responsibleName: ''
  })

  const handleSuccess = () => {
    loadReservations()
  }

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    loadReservations(activeFilters)
  }

  const clearFilters = () => {
    setFilters({
      checkInFrom: '',
      checkInTo: '',
      hotelId: '',
      responsibleName: ''
    })
    loadReservations()
  }

 const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
 }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Reservas</h1>
          <p className="text-muted-foreground">
            Gerencie as reservas do seu hotel
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <AddReservationForm onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtrar Reservas</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Responsável</label>
              <Input
                placeholder="Buscar por nome..."
                value={filters.responsibleName}
                onChange={(e) => setFilters({...filters, responsibleName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Hotel</label>
              <Select value={filters.hotelId} onValueChange={(value: string) => setFilters({...filters, hotelId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um hotel..." />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Check-in De</label>
              <Input
                type="date"
                value={filters.checkInFrom}
                onChange={(e) => setFilters({...filters, checkInFrom: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Check-in Até</label>
              <Input
                type="date"
                value={filters.checkInTo}
                onChange={(e) => setFilters({...filters, checkInTo: e.target.value})}
              />
            </div>
            
            <div className="flex items-end gap-2 lg:col-span-3">
              <Button onClick={applyFilters} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Limpar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Carregando reservas...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma reserva encontrada</p>
            <p className="text-sm mt-2">Clique em "Nova Reserva" para criar a primeira</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      {reservation.hotel.name || `Hotel #${reservation.hotelId}`}
                    </TableCell>
                    <TableCell>{reservation.responsibleName}</TableCell>
                    <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                    <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Hóspedes
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <GuestModal 
        reservation={selectedReservation || undefined}
        onClose={() => setSelectedReservation(null)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
