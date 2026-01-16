"use client"

import { AddReservationForm } from "@/components/add-reservation-form"
import { useReservations } from "@/hooks/use-reservations"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ReservationPage() {
  const { reservations, loading, loadReservations } = useReservations()

  const handleSuccess = () => {
    loadReservations()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
