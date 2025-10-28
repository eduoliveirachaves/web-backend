// src/product/dto/create-product.dto.ts

import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  sellerId: string;
}
