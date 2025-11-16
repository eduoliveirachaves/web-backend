import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '@/user/entities/user.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from 'generated/prisma/client';
import { Role } from 'generated/prisma/client';
import { Roles } from '@/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserEntity[]> {
    const users = await this.userService.findAll();
    return users.map((u) => new UserEntity(u));
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMe(@GetUser() user: User): UserEntity {
    return new UserEntity(user);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return new UserEntity(await this.userService.findOneById(id));
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return new UserEntity(await this.userService.updateMe(user, updateUserDto));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
