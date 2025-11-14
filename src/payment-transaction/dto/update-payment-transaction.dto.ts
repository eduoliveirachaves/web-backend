import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatusEnum } from './create-payment-transaction.dto';

export class UpdatePaymentTransactionDto {
  @IsOptional()
  @IsEnum(PaymentStatusEnum, {
    message: 'Status inválido. Use: AGUARDANDO, CONFIRMADO ou FALHOU',
  })
  status?: PaymentStatusEnum;

  @IsOptional()
  @IsString()
  gatewayResponse?: string;
}
