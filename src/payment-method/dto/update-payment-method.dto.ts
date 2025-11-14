import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { PaymentTypeEnum } from './create-payment-method.dto';

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsEnum(PaymentTypeEnum, {
    message: 'Tipo de pagamento inválido. Use: CARTAO, PIX ou BOLETO',
  })
  type?: PaymentTypeEnum;

  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Os dados mascarados devem ter no máximo 100 caracteres',
  })
  maskedData?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'O apelido deve ter no máximo 50 caracteres' })
  nickname?: string;
}
