import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value?.toUpperCase())
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  city: string;

  @IsInt()
  @Min(1)
  roomQuantity: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  stars?: number;
}
