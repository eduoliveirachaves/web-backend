import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const userData = {
      name: registerUserDto.name,
      email: registerUserDto.email,
      password: registerUserDto.password,
    };
    return this.userService.create(userData);
  }

  // async login(loginDto: LoginDto) {
  //   return 'to be implemented';
  // }
}
