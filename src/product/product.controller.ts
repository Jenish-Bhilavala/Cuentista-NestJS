import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ListOfProductDto } from './dto/create-product.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateProductDTO } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Post('addProduct')
  async createProduct(@Body() createProductDTO: CreateProductDto) {
    return this.productService.createProduct(createProductDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Get('viewProduct/:productId')
  @ApiParam({ example: 1, name: 'productId', required: true })
  async viewProduct(@Param('productId') productId: number) {
    return this.productService.viewProduct(productId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('viewListOfProduct')
  async ListOfProduct(@Body() listOfProductDto: ListOfProductDto) {
    return this.productService.listOfProduct(listOfProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('getListOfProduct')
  async getListOfProduct() {
    return this.productService.getListOfProduct();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Put('updateProduct/:productId')
  @ApiParam({ example: 1, name: 'productId', required: true })
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProductDTO: UpdateProductDTO
  ) {
    return this.productService.updateProduct(productId, updateProductDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('deleteProduct/:productId')
  @ApiParam({ example: 1, name: 'productId', required: true })
  async deleteProduct(@Param('productId') productId: number) {
    return this.productService.deleteProduct(productId);
  }
}
