"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema } from "@/lib/schemas/reservation"
import { reservationService } from "@/lib/services/reservation-service"
import { hotelService } from "@/lib/services/hotel-service"
import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface AddReservationFormProps {
  onSuccess: () => void;
}

export default function AddReservationForm({ onSuccess }: AddReservationFormProps) {
  const [open, setOpen] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorTitle, setErrorTitle] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [hotels, setHotels] = useState<any[]>([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelId: "",
      checkIn: "",
      checkOut: "",
      responsibleName: "",
    },
  })

  const { formState } = form

  React.useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await hotelService.getAll()
        setHotels(data as any[])
      } catch (error) {
        console.error("Erro ao carregar hotéis:", error)
      }
    }
    loadHotels()
  }, [])

  async function onSubmit(values: any) {
    try {
      await reservationService.create(values)
      onSuccess()
      setOpen(false)
      form.reset()
    } catch (error: any) {
      setErrorTitle("Erro ao Criar Reserva");
      const message = Array.isArray(error.message) ? error.message.join(', ') : error.message;
      setErrorMessage(message);
      setIsErrorDialogOpen(true);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Nova Reserva</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Nova Reserva</SheetTitle>
            <SheetDescription>
              Preencha os dados da reserva. Clique em salvar para criar.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form id="add-reservation-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-4 space-y-4">
              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <FormControl>
                      <select 
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Selecione um hotel</option>
                        {hotels.map((hotel) => (
                          <option key={hotel.id} value={hotel.id}>
                            {hotel.name} - {hotel.city}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <SheetFooter>
            <Button type="submit" form="add-reservation-form" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{errorTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
