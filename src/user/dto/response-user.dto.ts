import { Role } from './../../../generated/prisma';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: Role;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}
