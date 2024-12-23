import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/service.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('addService')
  async addProduct(@Body() dto: CreateServiceDto) {
    const service = await this.serviceService.addService(dto);
    return service;
  }

  @HttpCode(HttpStatus.OK)
  @Get('viewService/:serviceId')
  @ApiParam({ example: 1, name: 'serviceId', required: true })
  async viewProduct(@Param('serviceId') serviceId: number) {
    return await this.serviceService.viewService(serviceId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('deleteService/:serviceId')
  @ApiParam({ example: 1, name: 'serviceId', required: true })
  async deleteProduct(@Param('serviceId') serviceId: number) {
    return await this.serviceService.deleteService(serviceId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('getListOfService')
  async getListOfService() {
    return await this.serviceService.getListOfService();
  }
}
