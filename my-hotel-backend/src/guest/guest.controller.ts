import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { FilterGuestDto } from './dto/filter-guest.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('guests')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGuestDto: CreateGuestDto) {
    try {
      return await this.guestService.create(createGuestDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() filters: FilterGuestDto) {
    try {
      return await this.guestService.findAll(filters);
    } catch (error) {
      throw new BadRequestException('Erro ao buscar hóspedes: ' + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('reservation/:reservationId')
  async findByReservation(@Param('reservationId') reservationId: string) {
    try {
      return await this.guestService.findByReservation(reservationId);
    } catch (error) {
      throw new BadRequestException('Erro ao buscar hóspedes da reserva: ' + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.guestService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    try {
      return await this.guestService.update(id, updateGuestDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.guestService.remove(id);
      return { message: 'Hóspede removido com sucesso' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
