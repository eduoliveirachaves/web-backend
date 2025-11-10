import {
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
  IsInt,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'generated/prisma'; // ou declare o enum manualmente, se preferir

class UpdateOrderItemDto {
  @IsString()
  @IsOptional()
  productId?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;
}

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  items?: UpdateOrderItemDto[];
}
