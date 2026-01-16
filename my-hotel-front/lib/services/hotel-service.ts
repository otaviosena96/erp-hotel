import { api } from './api'
import { HotelFormData } from '../schemas/hotel'

export const hotelService = {
  async create(data: HotelFormData) {
    return api.post('/hotel', data)
  },

  async getAll() {
    return api.get('/hotel')
  },
}
