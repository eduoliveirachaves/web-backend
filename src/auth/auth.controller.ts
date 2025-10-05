import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signup(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  // @Get()
  // login() {
  //   return this.authService.findAll();
  // }
}
