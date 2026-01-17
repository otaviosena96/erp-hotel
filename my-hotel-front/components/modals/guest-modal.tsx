"use client"

import { GuestForm } from "@/components/forms/guest-form"
import { useGuests } from "@/hooks"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Users, X } from "lucide-react"

interface GuestModalProps {
  reservation: any
  onClose: () => void
  onSuccess: () => void
}

export default function GuestModal({ reservation, onClose, onSuccess }: GuestModalProps) {
  const { guests, loading, loadGuests } = useGuests(reservation?.id || '')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!reservation) {
    return null
  }

  return (
    <AlertDialog open={!!reservation} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Hóspedes da Reserva
            </AlertDialogTitle>
            <AlertDialogCancel className="rounded-sm opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            {reservation?.hotel?.name} - {reservation?.responsibleName}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Check-in: {formatDate(reservation.checkIn)} | 
                Check-out: {formatDate(reservation.checkOut)}
              </p>
            </div>
            <GuestForm 
              reservationId={reservation.id} 
              onSuccess={() => {
                loadGuests()
                onSuccess()
              }} 
            />
          </div>
          
          <GuestList guests={guests} loading={loading} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function GuestList({ guests, loading }: { guests: any[], loading: boolean }) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando hóspedes...</p>
  }

  if (guests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Nenhum hóspede cadastrado</p>
        <p className="text-sm mt-1">Clique em "Adicionar Hóspede" para começar</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {guests.map((guest: any) => (
        <div key={guest.id} className="flex justify-between items-center p-3 border rounded-lg bg-background">
          <div>
            <span className="font-medium">{guest.guestName}</span>
            <span className="text-sm text-muted-foreground ml-2">
              {guest.documentType} - {guest.document}
            </span>
          </div>
          <Badge variant="secondary">Hóspede</Badge>
        </div>
      ))}
    </div>
  )
}