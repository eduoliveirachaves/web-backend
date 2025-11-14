import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaymentTypeEnum } from './create-payment-method.dto';

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsEnum(PaymentTypeEnum)
  type?: PaymentTypeEnum;

  @IsOptional()
  @IsString()
  maskedData?: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
