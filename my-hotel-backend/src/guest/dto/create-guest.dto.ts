import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value?.toUpperCase())
  guestName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  document: string;

  @IsEnum(['CPF', 'PASSPORT'])
  @IsNotEmpty()
  documentType: 'CPF' | 'PASSPORT';

  @IsUUID()
  @IsNotEmpty()
  reservationId: string;
}
