import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const checkIn = new Date(createReservationDto.checkIn);
    const checkOut = new Date(createReservationDto.checkOut);
    
    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out deve ser posterior ao check-in');
    }   

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new BadRequestException('Check-in deve ser posterior ao dia atual');
    }

  
    const maxCheckOut = new Date(checkIn);
    maxCheckOut.setDate(maxCheckOut.getDate() + 31);
    
    if (checkOut > maxCheckOut) {
      throw new BadRequestException('Check-out deve ser no máximo 31 dias a partir do check-in');
    }


    
    const reservation = this.reservationRepository.create(createReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async findAll() {
    return await this.reservationRepository.find();
  }

  findOne(id: string) {
    return this.reservationRepository.findOne({ where: { id } });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.update(id, updateReservationDto);
  }

  remove(id: string) {
    return this.reservationRepository.delete(id);
  }
}
