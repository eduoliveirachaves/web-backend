import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum PaymentTypeEnum {
  CARTAO = 'CARTAO',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
}

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(PaymentTypeEnum)
  type: PaymentTypeEnum;

  @IsNotEmpty()
  @IsString()
  maskedData: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
