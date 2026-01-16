"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HotelForm } from "@/components/forms/hotel-form"
import { ErrorModal } from "@/components/modals/error-modal"
import { useErrorModal } from "@/hooks/use-error-modal"

interface AddHotelFormProps {
  onSuccess: () => void
}

export function AddHotelForm({ onSuccess }: AddHotelFormProps) {
  const [open, setOpen] = useState(false)
  const { isErrorModalOpen, errorTitle, errorMessage, closeErrorModal } = useErrorModal()

  const handleSuccess = () => {
    onSuccess()
    setOpen(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Adicionar Hotel</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Adicionar Novo Hotel</SheetTitle>
            <SheetDescription>
              Preencha os detalhes do novo hotel. Clique em salvar para criar.
            </SheetDescription>
          </SheetHeader>
          <HotelForm onSuccess={handleSuccess} />
        </SheetContent>
      </Sheet>
      
      <ErrorModal 
        open={isErrorModalOpen}
        onOpenChange={closeErrorModal}
        title={errorTitle}
        message={errorMessage}
      />
    </>
  )
}
