import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  // o userId deve vit do token de autenticação,
  // mas aqui o cliente esta enviando. Arrumar depois!!
  @IsString()
  @IsNotEmpty({ message: 'O ID do usuário (comprador) é obrigatório.' })
  readonly userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];
}
