import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '@/auth/dto/register-user.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { UserDto } from '@/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() registerUserDto: RegisterUserDto): Promise<UserDto> {
    return new UserDto(await this.authService.register(registerUserDto));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
