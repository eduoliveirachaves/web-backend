import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, User } from 'generated/prisma';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    if (!users) {
      throw new NotFoundException(`Users not found`);
    }

    return users;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  updateMe(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { ...updateUserDto },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    await this.findOneById(id);

    return this.prisma.user.delete({ where: { id } });
  }
}
