import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterGuestDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Transform(({ value }) => value?.toUpperCase())
  guestName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => value?.replace(/\D/g, '')) // Remove caracteres não numéricos
  document?: string;
}
