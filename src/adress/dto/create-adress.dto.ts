import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAdressDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 8, {
    message: 'O CEP deve conter exatamente 8 caracteres numéricos.',
  })
  cep: string;
}
