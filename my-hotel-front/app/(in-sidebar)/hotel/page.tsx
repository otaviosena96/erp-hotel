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
import { AddHotelForm } from "@/components/add-hotel-form"
import { useHotels } from "@/hooks/use-hotels"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Hotel() {
  const { hotels, loading, loadHotels } = useHotels()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    city: ''
  })

  const handleSuccess = () => {
    loadHotels()
  }

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    loadHotels(activeFilters)
  }

  const clearFilters = () => {
    setFilters({
      name: '',
      city: ''
    })
    loadHotels()
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Hotéis</h1>
          <p className="text-muted-foreground">
            Gerencie os hotéis do seu grupo
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <AddHotelForm onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtrar Hotéis</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Hotel</label>
              <Input
                placeholder="Buscar por nome..."
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cidade</label>
              <Input
                placeholder="Buscar por cidade..."
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
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
            <p>Carregando hotéis...</p>
          </div>
        ) : hotels.length === 0 ? (
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
                {hotels.map((item: any) => (
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
