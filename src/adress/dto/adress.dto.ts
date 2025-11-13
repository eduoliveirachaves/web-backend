import { Expose } from 'class-transformer';

export class AdressDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  street: string;

  @Expose()
  number: string;

  @Expose()
  complement?: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  cep: string;
}
