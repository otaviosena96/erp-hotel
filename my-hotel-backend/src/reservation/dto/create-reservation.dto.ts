import { IsString, IsNotEmpty, MaxLength, IsDateString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  hotelId: string;

  @IsDateString()
  @IsNotEmpty()
  checkIn: string;

  @IsDateString()
  @IsNotEmpty()
  checkOut: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  responsibleName: string;
}
