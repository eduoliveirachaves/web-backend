import { UserService } from '@/user/user.service';
import { RegisterUserDto } from '@/user/dto/register-user.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '@/user/dto/response-user.dto';
import { LoginDto } from '@/user/dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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

    const userExists = await this.userService.findOneByEmail(registerDto.email);

    if (userExists) {
      throw new BadRequestException('O usuário já existe.');
    }

    // ts-expect-error -> era um decorator, tirei apenas o @
    // nao conseguia rodar mesmo com ele comentado
    //const saltOrRounds: string = process.env.SALT_OR_ROUNDS;
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

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  comparePasswords(password: string, passwordConfirmation: string): boolean {
    return password === passwordConfirmation;
  }
}
