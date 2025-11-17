import { UserService } from '@/user/user.service';
import { RegisterUserDto } from '@/auth/dto/register-user.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import type { User } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    const passwordsMatch = this.comparePasswords(
      registerDto.password,
      registerDto.passwordConfirmation,
    );

    if (!passwordsMatch) {
      throw new BadRequestException('As senhas não conferem.');
    }

    const userExists = await this.checkUserExists(registerDto.email);

    if (userExists) {
      throw new ConflictException('Um usuário com este email já existe.');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    return this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      age: registerDto.age,
    });
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.buildTokenPayload(user);
  }

  private comparePasswords(
    password: string,
    passwordConfirmation: string,
  ): boolean {
    return password === passwordConfirmation;
  }

  private async checkUserExists(email: string): Promise<boolean> {
    try {
      await this.userService.findOneByEmail(email);
      return true;
    } catch (error) {
      // Se o erro nao for o NotFound como esperado joga o erro novamente
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
      return false;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS) || 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  private buildTokenPayload(user: User): { token: string } {
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
