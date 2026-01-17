import { api } from './api'
import { HotelFormData } from '../schemas/hotel'

export const hotelService = {
  async create(data: HotelFormData) {
    return api.post('/hotel', data)
  },

  async getAll(filters?: any) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() 
      ? `/hotel?${params.toString()}`
      : '/hotel';

    return api.get(url)
  },
}
