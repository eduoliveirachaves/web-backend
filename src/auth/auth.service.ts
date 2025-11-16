import { UserService } from '@/user/user.service';
import { RegisterUserDto } from '@/auth/dto/register-user.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '@/user/dto/response-user.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { async } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<UserResponseDto> {
    const passwordsMatch = this.comparePasswords(
      registerDto.password,
      registerDto.passwordConfirmation,
    );

    if (!passwordsMatch) {
      throw new BadRequestException('As senhas não conferem.');
    }

    try {
      await this.userService.findOneByEmail(registerDto.email);

      throw new ConflictException('Um usuário com este email já existe.');
    } catch (error) {
      // Se o erro nao for o NotFound como esperado joga o erro novamente
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      saltOrRounds,
    );

    const newUser = await this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      age: registerDto.age,
    });

    const { password: _, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordIsCorrect: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  comparePasswords(password: string, passwordConfirmation: string): boolean {
    return password === passwordConfirmation;
  }
}
