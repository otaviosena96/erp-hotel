import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('guests')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  async create(@Body() createGuestDto: CreateGuestDto) {
    return await this.guestService.create(createGuestDto);
  }

  @Get()
  async findAll() {
    return await this.guestService.findAll();
  }

  @Get('reservation/:reservationId')
  async findByReservation(@Param('reservationId') reservationId: string) {
    return await this.guestService.findByReservation(reservationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.guestService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return await this.guestService.update(id, updateGuestDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.guestService.remove(id);
    return { message: 'Hóspede removido com sucesso' };
  }
}
