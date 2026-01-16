"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { hotelSchema } from "@/lib/schemas/hotel"
import { hotelService } from "@/lib/services/hotel-service"
import { useErrorModal } from "@/hooks/use-error-modal"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface HotelFormProps {
  onSuccess: () => void
}

export function HotelForm({ onSuccess }: HotelFormProps) {
  const { showError } = useErrorModal()

  const form = useForm({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: "",
      city: "",
      roomQuantity: 1,
    },
  })

  const { formState } = form

  const onSubmit = async (values: any) => {
    try {
      await hotelService.create(values)
      onSuccess()
      form.reset()
    } catch (error: any) {
      showError("Erro ao Criar Hotel", error.message || "Falha ao criar hotel")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-4 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Hotel Palace" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº de Quartos</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="100" 
                  value={field.value as number}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={formState.isSubmitting} className="w-full">
          {formState.isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Form>
  )
}