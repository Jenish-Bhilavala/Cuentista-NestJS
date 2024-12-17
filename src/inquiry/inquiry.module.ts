import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { InquiryModel } from '../model/inquiry.model';

@Module({
  imports: [SequelizeModule.forFeature([InquiryModel])],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
