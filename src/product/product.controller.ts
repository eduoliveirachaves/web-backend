import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles } from '@/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ProductDto } from '@/product/dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return new ProductDto(await this.productService.create(createProductDto));
  }

  @Get()
  async findAll(
      @Query() paginationDto: PaginationDto,
      @Query('search') search?: string,
    ): Promise<ProductDto[]> {
        console.log('>>> CHEGOU NO BACKEND!');
        console.log('>>> Termo de busca:', search);
        const products = await this.productService.findAll(paginationDto, search);
        console.log('>>> Produtos encontrados no banco:', products.length);
        return products.map((u) => new ProductDto(u));
    }
  
  // @Get("seller/:sellerId")
  // async findAllBySeller(@Query() paginationDto: PaginationDto): Promise<ProductDto[]> {
  //   const products = await this.productService.findAllBySeller(paginationDto);
  //   return products.map((u) => new ProductDto(u));
  // }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    return new ProductDto(await this.productService.findOne(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return new ProductDto(
      await this.productService.update(id, updateProductDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ProductDto> {
    return new ProductDto(await this.productService.remove(id));
  }
}
