import type { Role } from 'generated/prisma/client';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  id?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  name?: string;
  @IsOptional()
  password?: string;
  @IsOptional()
  role?: Role;
  @IsOptional()
  age?: number;
  @IsOptional()
  createdAt?: Date;
  @IsOptional()
  updatedAt?: Date;
}

export class UpdateMyProfileDto {
  @IsEmail()
  email?: string;
  @IsString()
  name?: string;
  @IsOptional()
  password?: string;
  @IsNumber()
  @Min(16)
  @Max(120)
  age?: number;
}
