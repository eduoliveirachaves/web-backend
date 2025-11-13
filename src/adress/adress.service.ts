import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { AdressEntity } from './entities/adress.entity';

@Injectable()
export class AdressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdressDto: CreateAdressDto): Promise<AdressEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: createAdressDto.userId },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const adress = await this.prisma.adress.create({
      data: {
        userId: createAdressDto.userId,
        street: createAdressDto.street,
        number: createAdressDto.number,
        complement: createAdressDto.complement,
        city: createAdressDto.city,
        state: createAdressDto.state,
        cep: createAdressDto.cep,
      },
    });

    return adress;
  }

  async findAll(): Promise<AdressEntity[]> {
    return await this.prisma.adress.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAllByUser(userId: string): Promise<AdressEntity[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.prisma.adress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<AdressEntity> {
    const adress = await this.prisma.adress.findUnique({ where: { id } });

    if (!adress) {
      throw new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND);
    }

    return adress;
  }

  async update(
    id: string,
    updateAdressDto: UpdateAdressDto,
  ): Promise<AdressEntity> {
    const adress = await this.prisma.adress.findUnique({ where: { id } });

    if (!adress) {
      throw new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.prisma.adress.update({
      where: { id },
      data: {
        street: updateAdressDto.street ?? adress.street,
        number: updateAdressDto.number ?? adress.number,
        complement: updateAdressDto.complement ?? adress.complement,
        city: updateAdressDto.city ?? adress.city,
        state: updateAdressDto.state ?? adress.state,
        cep: updateAdressDto.cep ?? adress.cep,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const adress = await this.prisma.adress.findUnique({ where: { id } });

    if (!adress) {
      throw new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND);
    }

    await this.prisma.adress.delete({ where: { id } });
  }
}
