"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Users, X, Calendar, MapPin } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface GuestReservationsModalProps {
  guest: any
  onClose: () => void
}

export default function GuestReservationsModal({ guest, onClose }: GuestReservationsModalProps) {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  if (!guest) {
    return null
  }

  return (
    <AlertDialog open={!!guest} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Todas as Reservas de {guest.guestName}
            </AlertDialogTitle>
            <AlertDialogCancel className="rounded-sm opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            {guest.guestName} - {guest.document}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="mt-4">
          {guest.reservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma reserva encontrada para este hóspede</p>
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
                  {guest.reservations.map((reservation: any, index: number) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {reservation.hotel?.name || `Hotel #${reservation.id}`}
                        </div>
                      </TableCell>
                      <TableCell>{reservation.responsibleName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(reservation.checkIn)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(reservation.checkOut)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
