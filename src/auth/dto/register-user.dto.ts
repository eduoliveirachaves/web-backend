import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class RegisterUserDto {
  /**
   * O nome do usuário.
   * Não pode ser uma string vazia.
   * @example 'John Doe'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * O email do usuário.
   * Deve ter um formato de email válido e não pode ser vazio.
   * @example 'johndoe@email.com'
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * A senha do usuário.
   * Deve ter no mínimo 8 caracteres para segurança básica.
   * @example 'password123'
   */
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;

  /**
   * Campo de confirmação de senha.
   * @example 'password123'
   */
  @IsString()
  @MinLength(8, {
    message: 'A confirmação de senha deve ter no mínimo 8 caracteres.',
  })
  passwordConfirmation: string;

  @IsNumber()
  @Min(16, {
    message: 'A idade deve ser maior que 16 anos.',
  })
  @Max(120, {
    message: 'A idade deve ser menor que 120 anos.',
  })
  age: number;
}
