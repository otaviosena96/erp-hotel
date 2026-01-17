import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterReservationDto {
  @IsDateString()
  @IsOptional()
  checkInFrom?: string;

  @IsDateString()
  @IsOptional()
  checkInTo?: string;

  @IsUUID()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  responsibleName?: string;
}
