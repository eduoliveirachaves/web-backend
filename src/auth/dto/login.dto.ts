// src/user/dto/login.dto.ts

import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  /**
   * O email do usuário para login.
   * @example 'johndoe@email.com'
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * A senha do usuário para login.
   * @example 'password123'
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
