import type { Role } from 'generated/prisma/client';
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateUserDto {
  id?: string;
  email?: string;
  name?: string;
  password?: string;
  role?: Role;
  age?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UpdateMyProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(16)
  @Max(120)
  @IsOptional()
  age?: number;
}
