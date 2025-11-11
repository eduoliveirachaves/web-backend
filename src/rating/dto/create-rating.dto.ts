import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rate: number;

  @IsString()
  @IsOptional()
  @Length(0, 200, { message: 'O comentário deve ter no máximo 200 caracteres' })
  comment: string;
}
