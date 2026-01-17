import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    this.validateGuestData(createGuestDto);
    await this.validateGuestLimitPerReservation(createGuestDto.reservationId);
    await this.validateGuestUniqueInReservation(
      createGuestDto.document,
      createGuestDto.reservationId,
    );

    const guest = this.guestRepository.create(createGuestDto);
    return await this.guestRepository.save(guest);
  }

  async findAll(): Promise<Guest[]> {
    return await this.guestRepository.find();
  }

  async findByReservation(reservationId: string): Promise<Guest[]> {
    return await this.guestRepository.find({
      where: { reservationId },
    });
  }

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) {
      throw new NotFoundException(`Hóspede com ID ${id} não encontrado`);
    }
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    const existingGuest = await this.findOne(id);

    this.validateDocumentUpdate(updateGuestDto);

    await this.validateUniquenessOnUpdate(existingGuest, updateGuestDto);

    await this.guestRepository.update(id, updateGuestDto);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const guest = await this.findOne(id);
    await this.guestRepository.delete(id);
  }

  private validateDocumentUpdate(updateGuestDto: UpdateGuestDto): void {
    if (updateGuestDto.document && updateGuestDto.documentType) {
      this.validateDocument(
        updateGuestDto.document,
        updateGuestDto.documentType,
      );
    }
  }

  private async validateUniquenessOnUpdate(
    existingGuest: Guest,
    updateGuestDto: UpdateGuestDto,
  ): Promise<void> {
    const newDocument = updateGuestDto.document || existingGuest.document;
    const newReservationId =
      updateGuestDto.reservationId || existingGuest.reservationId;

    if (
      newDocument !== existingGuest.document ||
      newReservationId !== existingGuest.reservationId
    ) {
      await this.validateGuestUniqueInReservation(
        newDocument,
        newReservationId,
      );
    }
  }

  private validateGuestData(createGuestDto: CreateGuestDto): void {
    this.validateDocument(createGuestDto.document, createGuestDto.documentType);
  }

  private validateDocument(
    document: string,
    documentType: 'CPF' | 'PASSPORT',
  ): void {
    if (documentType === 'CPF') {
      if (!cpf.isValid(document)) {
        throw new BadRequestException('CPF inválido');
      }
    } else {
      if (document.length < 6 || document.length > 20) {
        throw new BadRequestException(
          'Passaporte deve conter entre 6 e 20 caracteres',
        );
      }
    }
  }

  private async validateGuestUniqueInReservation(
    document: string,
    reservationId: string,
  ): Promise<void> {
    const existingGuest = await this.guestRepository.findOne({
      where: { document, reservationId },
    });

    if (existingGuest) {
      throw new BadRequestException('Hóspede já está cadastrado nesta reserva');
    }
  }

  private async validateGuestLimitPerReservation(
    reservationId: string,
  ): Promise<void> {
    const currentGuests = await this.guestRepository.find({
      where: { reservationId },
    });

    if (currentGuests.length >= 10) {
      throw new BadRequestException(
        'Limite de 10 hóspedes por reserva atingido',
      );
    }
  }
}
