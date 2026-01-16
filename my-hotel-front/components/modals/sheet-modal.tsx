"use client"

import { ReactNode } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface SheetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
  trigger?: ReactNode
  submitButtonText?: string
  onSubmit?: () => void
  formId?: string
}

export function SheetModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  submitButtonText = "Salvar",
  onSubmit,
  formId,
}: SheetModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        {onSubmit && (
          <SheetFooter>
            <Button type="submit" form={formId} onClick={onSubmit}>
              {submitButtonText}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
