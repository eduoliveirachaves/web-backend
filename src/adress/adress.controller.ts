import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdressService } from './adress.service';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { AdressEntity } from './entities/adress.entity';

@Controller('adress')
export class AdressController {
  constructor(private readonly adressService: AdressService) {}

  @Post()
  create(@Body() createAdressDto: CreateAdressDto): Promise<AdressEntity> {
    return this.adressService.create(createAdressDto);
  }

  @Get()
  findAll(): Promise<AdressEntity[]> {
    return this.adressService.findAll();
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string): Promise<AdressEntity[]> {
    return this.adressService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdressEntity> {
    return this.adressService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdressDto: UpdateAdressDto,
  ): Promise<AdressEntity> {
    return this.adressService.update(id, updateAdressDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.adressService.delete(id);
  }
}
