import type { Role } from 'generated/prisma/client';

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
