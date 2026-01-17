"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAllGuests } from "@/hooks/use-all-guests"
import { useReservations } from "@/hooks/use-reservations"
import { Search, Filter, X, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import GuestReservationsModal from "@/components/modals/guest-reservations-modal"

interface GuestWithReservations {
  id: string
  guestName: string
  document: string
  documentType: 'CPF' | 'PASSPORT'
  reservations: Array<{
    id: string
    hotel: {
      name: string
    }
    checkIn: string
    checkOut: string
    responsibleName: string
  }>
  createdAt: string
  updatedAt: string
}

export default function GuestPage() {
  const { guests, loading, loadGuests } = useAllGuests()
  const { reservations } = useReservations()
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<GuestWithReservations | null>(null)
  const [filters, setFilters] = useState({
    guestName: '',
    document: ''
  })

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    loadGuests(activeFilters)
  }

  const clearFilters = () => {
    setFilters({
      guestName: '',
      document: ''
    })
    loadGuests()
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  const formatDocument = (document: string) => {
    if (document.length === 11) {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return document
  }

  const groupReservationsByGuest = (guests: any[]): GuestWithReservations[] => {
    const guestMap = new Map<string, GuestWithReservations>()
    
    guests.forEach((guest: any) => {
      const reservation = reservations.find(r => r.id === guest.reservationId)
      
      if (!guestMap.has(guest.document)) {
        guestMap.set(guest.document, {
          id: guest.id,
          guestName: guest.guestName,
          document: guest.document,
          documentType: guest.documentType,
          reservations: [],
          createdAt: guest.createdAt,
          updatedAt: guest.updatedAt
        })
      }
      
      const guestEntry = guestMap.get(guest.document)!
      if (reservation) {
        guestEntry.reservations.push({
          id: reservation.id,
          hotel: reservation.hotel,
          checkIn: reservation.checkIn,
          checkOut: reservation.checkOut,
          responsibleName: reservation.responsibleName
        })
      }
    })
    
    return Array.from(guestMap.values())
  }

  const guestsWithReservations = groupReservationsByGuest(guests)

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Hóspedes</h1>
          <p className="text-muted-foreground">
            Gerencie os hóspedes do seu hotel
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtrar Hóspedes</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Hóspede</label>
              <Input
                placeholder="Buscar por nome..."
                value={filters.guestName}
                onChange={(e) => setFilters({...filters, guestName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">CPF/Passaporte</label>
              <Input
                placeholder="Buscar por documento..."
                value={filters.document}
                onChange={(e) => setFilters({...filters, document: e.target.value.replace(/\D/g, '')})}
              />
            </div>
            
            <div className="flex items-end gap-2">
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
            <p>Carregando hóspedes...</p>
          </div>
        ) : guestsWithReservations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum hóspede encontrado</p>
            <p className="text-sm mt-2">Os hóspedes aparecem aqui quando são adicionados às reservas</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guestsWithReservations.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.guestName}</TableCell>
                    <TableCell>{formatDocument(guest.document)}</TableCell>
                    <TableCell>
                      {guest.reservations.length > 0 ? guest.reservations[0].hotel?.name : '-'}
                    </TableCell>
                    <TableCell>
                      {guest.reservations.length > 0 ? formatDate(guest.reservations[0].checkIn) : '-'}
                    </TableCell>
                    <TableCell>
                      {guest.reservations.length > 0 ? formatDate(guest.reservations[0].checkOut) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {guest.reservations.length} {guest.reservations.length === 1 ? 'reserva' : 'reservas'}
                        </span>
                        <button
                          onClick={() => setSelectedGuest(guest)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Reservas
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

      <GuestReservationsModal 
        guest={selectedGuest}
        onClose={() => setSelectedGuest(null)}
      />
    </div>
  )
}
