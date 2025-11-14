import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';

export enum PaymentTypeEnum {
  CARTAO = 'CARTAO',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
}

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsEnum(PaymentTypeEnum, {
    message: 'Tipo de pagamento inválido. Use: CARTAO, PIX ou BOLETO',
  })
  type: PaymentTypeEnum;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100, {
    message: 'Os dados mascarados devem ter no máximo 100 caracteres',
  })
  maskedData: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'O apelido deve ter no máximo 50 caracteres' })
  nickname?: string;
}
