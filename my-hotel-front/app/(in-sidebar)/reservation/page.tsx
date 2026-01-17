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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from "lucide-react"

export default function ReservationPage() {
  const { reservations, loading, loadReservations } = useReservations()
  const [selectedReservation, setSelectedReservation] = useState<any>(null)

  const handleSuccess = () => {
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
        <AddReservationForm onSuccess={handleSuccess} />
      </div>
      
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
