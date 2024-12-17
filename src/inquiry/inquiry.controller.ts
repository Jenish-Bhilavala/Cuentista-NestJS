import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Put,
  Param,
} from '@nestjs/common';
import { InquiryDto, listOfInquiryDto } from './dto/inquiry.dto';
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
  @Post('/listOfInquiry')
  async listOfInquiry(@Body() dto: listOfInquiryDto) {
    return this.inquiryService.listOfInquiry(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/updateInquiry/:id')
  async updateInquiry(@Param('id') inquiryId: number) {
    return this.inquiryService.updateInquiry(inquiryId);
  }
}
