import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Put,
  Param,
} from '@nestjs/common';
import { AddInquiryDto, listOfInquiryDto } from './dto/inquiry.dto';
import { InquiryService } from './inquiry.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Inquiries')
@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/addInquiry')
  async createInquiry(@Body() inquiryDto: AddInquiryDto) {
    return this.inquiryService.createInquiry(inquiryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/listOfInquiry')
  async listOfInquiry(@Body() dto: listOfInquiryDto) {
    return this.inquiryService.listOfInquiry(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/updateInquiry/:inquiryId')
  @ApiParam({ example: 1, name: 'inquiryId', required: true })
  async updateInquiry(@Param('inquiryId') inquiryId: number) {
    return this.inquiryService.updateInquiry(inquiryId);
  }
}
