import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '@/user/entities/user.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
// import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from 'generated/prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    const users = await this.userService.findAll();
    return users.map((u) => new UserEntity(u));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@GetUser() user: User): UserEntity {
    return new UserEntity(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return new UserEntity(await this.userService.findOneById(id));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserEntity> {
    return new UserEntity(await this.userService.remove(id));
  }
}
