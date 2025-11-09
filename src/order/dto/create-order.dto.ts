import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemCompradoDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do produto é obrigatório.' })
  productId: string; // Deve ser o ID do Produto

  @IsInt()
  @IsPositive({ message: 'A quantidade deve ser um número inteiro positivo.' })
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  // o userId deve vit do token de autenticação,
  // mas aqui o cliente esta enviando. Arrumar depois!!
  @IsString()
  @IsNotEmpty({ message: 'O ID do usuário (comprador) é obrigatório.' })
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCompradoDto)
  items: ItemCompradoDto[];
}
