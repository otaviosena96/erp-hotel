"use client"

import { createApiUrl } from '@/lib/config/api'

const handleAuthError = (status: number) => {
  if (status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddHotelForm } from "@/components/add-hotel-form"

export default function Hotel() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    try {
      const response = await fetch(createApiUrl('/hotel'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        handleAuthError(response.status)
        throw new Error('Falha ao buscar dados')
      }
      const json = await response.json()
      setData(json)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Hotéis</h1>
          <p className="text-muted-foreground">
            Gerencie os hotéis do seu grupo
          </p>
        </div>
        <AddHotelForm onSuccess={fetchData} />
      </div>
      
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Carregando hotéis...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum hotel encontrado</p>
            <p className="text-sm mt-2">Clique em "Novo Hotel" para criar o primeiro</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Nº de quartos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.roomQuantity}</TableCell>
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
