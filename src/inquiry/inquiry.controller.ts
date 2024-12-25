import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { InquiryDto } from './dto/inquiry.dto';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/addInquiry')
  async createInquiry(@Body() inquiryDto: InquiryDto) {
    return this.inquiryService.createInquiry(inquiryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/listOfInquiry')
  async listOfInquiry() {
    return this.inquiryService.listOfInquiry();
  }

  @HttpCode(HttpStatus.OK)
  @Put('/updateInquiry/:id')
  async updateInquiry(@Param('id') inquiryId: number) {
    return this.inquiryService.updateInquiry(inquiryId);
  }
}
