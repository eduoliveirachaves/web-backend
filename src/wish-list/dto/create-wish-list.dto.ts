import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateWishListDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
