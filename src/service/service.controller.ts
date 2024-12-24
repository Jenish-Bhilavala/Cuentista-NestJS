import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Param,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import {
  CreateServiceDto,
  ListOfServiceDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateProductDTO } from 'src/product/dto/update-product.dto';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('addService')
  async addService(@Body() dto: CreateServiceDto) {
    return await this.serviceService.addService(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('viewListOfService')
  async ListOfProduct(@Body() dto: ListOfServiceDto) {
    return this.serviceService.listOfService(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('viewService/:serviceId')
  @ApiParam({ example: 1, name: 'serviceId', required: true })
  async viewService(@Param('serviceId') serviceId: number) {
    return await this.serviceService.viewService(serviceId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('deleteService/:serviceId')
  @ApiParam({ example: 1, name: 'serviceId', required: true })
  async deleteService(@Param('serviceId') serviceId: number) {
    return await this.serviceService.deleteService(serviceId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('getListOfService')
  async getListOfService() {
    return await this.serviceService.getListOfService();
  }

  @HttpCode(HttpStatus.OK)
  @Put('updateService/:serviceId')
  @ApiParam({ example: 1, name: 'serviceId', required: true })
  async updateService(
    @Param('serviceId') serviceId: number,
    @Body() dto: UpdateServiceDto
  ) {
    return await this.serviceService.updateService(serviceId, dto);
  }
}
