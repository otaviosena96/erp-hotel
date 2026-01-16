import { 
  IsString, 
  IsNotEmpty, 
  MaxLength, 
  IsEnum, 
  IsUUID,
  registerDecorator,
  ValidationOptions
} from 'class-validator';



export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
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
