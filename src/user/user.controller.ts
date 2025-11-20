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
import { UserDto } from '@/user/dto/user.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { UpdateMyProfileDto, UpdateUserDto } from './dto/update-user.dto';
import type { User } from 'generated/prisma/client';
import { Role } from 'generated/prisma/client';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    return users.map((u) => new UserDto(u));
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMe(@GetUser() user: User): UserDto {
    return new UserDto(user);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return new UserDto(await this.userService.findOneById(id));
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateMyProfileDto,
  ): Promise<UserDto> {
    return new UserDto(await this.userService.updateMe(user, updateUserDto));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return new UserDto(await this.userService.update(id, updateUserDto));
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
