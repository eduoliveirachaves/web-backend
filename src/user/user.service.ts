import { Injectable } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOneById(id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
  // a implementar
  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   if (updateUserDto) {
  //     console.log(updateUserDto);
  //   }
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
