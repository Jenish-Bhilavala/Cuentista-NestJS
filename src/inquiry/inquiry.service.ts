import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InquiryModel } from '../model/inquiry.model';
import { InquiryDto } from './dto/inquiry.dto';
import { HandleResponse } from '../libs/services/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { Messages } from 'src/libs/utils/constants/message';
import { emailSend } from 'src/libs/helpers/mail';
import { Status } from 'src/libs/utils/constants/enum';

@Injectable()
export class InquiryService {
  constructor(
    @InjectModel(InquiryModel)
    private readonly inquiryModel: typeof InquiryModel
  ) {}

  async createInquiry(inquiryDto: InquiryDto): Promise<any> {
    const inquiry = await this.inquiryModel.create(inquiryDto);

    const { email, first_name, last_name, phone_number, message } = inquiryDto;

    await emailSend({
      email,
      firstName: first_name,
      lastName: last_name,
      phone: phone_number,
      messageContent: message,
    });

    Logger.log(`Inquiry ${Messages.ADD_SUCCESS}`);
    return HandleResponse(
      HttpStatus.CREATED,
      ResponseData.SUCCESS,
      `Inquiry ${Messages.ADD_SUCCESS}`,
      { id: inquiry.id }
    );
  }

  async listOfInquiry(): Promise<any> {
    const inquiries = await this.inquiryModel.findAll();

    Logger.log(`Inquiries ${Messages.NOT_FOUND}`);
    if (inquiries.length === 0) {
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Inquiries ${Messages.NOT_FOUND}`
      );
    }

    Logger.log(`Inquiries ${Messages.RETRIEVED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      inquiries
    );
  }

  async updateInquiry(inquiryId: number): Promise<any> {
    const inquiry = await this.inquiryModel.findByPk(inquiryId);

    Logger.log(`Inquiry ${Messages.NOT_FOUND}`);
    if (!inquiry) {
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Inquiry ${Messages.NOT_FOUND}`
      );
    }

    Logger.log(Messages.INQUIRY_ALREADY_RESOLVE);
    if (inquiry.status === Status.RESOLVE) {
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.INQUIRY_ALREADY_RESOLVE
      );
    }

    inquiry.status = Status.RESOLVE;
    await inquiry.save();

    Logger.log(`Inquiry ${Messages.UPDATE_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Inquiry ${Messages.UPDATE_SUCCESS}`,
      { id: inquiry.id, status: inquiry.status }
    );
  }
}
