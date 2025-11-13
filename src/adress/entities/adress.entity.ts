import { Expose } from 'class-transformer';

export class AdressEntity {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  street: string;

  @Expose()
  number: string;

  @Expose()
  complement?: string | null;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  cep: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
