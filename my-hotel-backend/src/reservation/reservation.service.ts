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
    this.validateReservationDates(
      createReservationDto.checkIn,
      createReservationDto.checkOut,
    );

    const reservation = this.reservationRepository.create(createReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find();
  }

  async findOne(id: string): Promise<Reservation | null> {
    return await this.reservationRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<void> {
    if (updateReservationDto.checkIn && updateReservationDto.checkOut) {
      this.validateReservationDates(
        updateReservationDto.checkIn,
        updateReservationDto.checkOut,
      );
    }
    await this.reservationRepository.update(id, updateReservationDto);
  }

  async remove(id: string): Promise<void> {
    await this.reservationRepository.delete(id);
  }

  private validateReservationDates(checkIn: string, checkOut: string): void {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    this.validateCheckOutAfterCheckIn(checkInDate, checkOutDate);
    this.validateCheckInNotInPast(checkInDate);
    this.validateMaximumStayDuration(checkInDate, checkOutDate);
  }

  private validateCheckOutAfterCheckIn(checkIn: Date, checkOut: Date): void {
    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out deve ser posterior ao check-in');
    }
  }

  private validateCheckInNotInPast(checkIn: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new BadRequestException('Check-in deve ser posterior ao dia atual');
    }
  }

  private validateMaximumStayDuration(checkIn: Date, checkOut: Date): void {
    const MAX_STAY_DAYS = 31;
    const maxCheckOut = new Date(checkIn);
    maxCheckOut.setDate(maxCheckOut.getDate() + MAX_STAY_DAYS);

    if (checkOut > maxCheckOut) {
      throw new BadRequestException(
        `Check-out deve ser no máximo ${MAX_STAY_DAYS} dias a partir do check-in`,
      );
    }
  }
}
