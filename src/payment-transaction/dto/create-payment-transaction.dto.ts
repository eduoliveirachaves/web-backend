import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PaymentStatusEnum {
  AGUARDANDO = 'AGUARDANDO',
  CONFIRMADO = 'CONFIRMADO',
  FALHOU = 'FALHOU',
}

export enum PaymentGatewayEnum {
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  PAGSEGURO = 'PAGSEGURO',
}

export class CreatePaymentTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'O valor deve ser maior que zero' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentGatewayEnum, {
    message: 'Gateway inválido. Use: PAYPAL, STRIPE ou PAGSEGURO',
  })
  gateway: PaymentGatewayEnum;

  @IsOptional()
  @IsEnum(PaymentStatusEnum, {
    message: 'Status inválido. Use: AGUARDANDO, CONFIRMADO ou FALHOU',
  })
  status?: PaymentStatusEnum;

  @IsOptional()
  @IsString()
  gatewayResponse?: string;
}
