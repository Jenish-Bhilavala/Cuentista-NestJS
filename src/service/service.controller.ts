import { Controller, Post, Body } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/service.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceModel } from '../model/service.model';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('addService')
  @ApiOperation({ summary: 'Add a new service' })
  @ApiResponse({
    status: 201,
    description: 'Service has been successfully created',
    type: ServiceModel,
  })
  async addProduct(@Body() dto: CreateServiceDto) {
    const service = await this.serviceService.addService(dto);
    return service;
  }
}
