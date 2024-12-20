import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InquiryModel } from '../model/inquiry.model';
import { AddInquiryDto, listOfInquiryDto } from './dto/inquiry.dto';
import { HandleResponse } from '../libs/services/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { Messages } from 'src/libs/utils/constants/message';
import { emailSend } from 'src/libs/helpers/mail';
import { Status } from 'src/libs/utils/constants/enum';
import { pagination, sorting } from '../libs/utils/constants/commonFunctions';
import { Op } from 'sequelize';

@Injectable()
export class InquiryService {
  constructor(
    @InjectModel(InquiryModel)
    private readonly inquiryModel: typeof InquiryModel
  ) {}

  async createInquiry(dto: AddInquiryDto) {
    const { email, first_name, last_name, phone_number, message } = dto;
    const inquiry = await this.inquiryModel.create(dto);

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

  async listOfInquiry(dto: listOfInquiryDto) {
    const { search, pageSize, page, sortValue, sortKey } = dto;
    const sortQuery = sorting(sortKey, sortValue);

    const whereCondition: any = {
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'message',
        'status',
      ],
      order: sortQuery,
      where: {},
    };

    if (search) {
      whereCondition.where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
        { status: { [Op.like]: `%${search}%` } },
      ];
    }

    const paginationResult = await pagination(
      this.inquiryModel,
      page,
      pageSize,
      whereCondition,
      'inquiries'
    );

    if (paginationResult.inquiries && paginationResult.inquiries.length <= 0) {
      Logger.error(`Inquiries ${Messages.NOT_FOUND}`);
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
      paginationResult
    );
  }

  async updateInquiry(inquiryId: number) {
    const inquiry = await this.inquiryModel.findByPk(inquiryId);

    if (!inquiry) {
      Logger.log(`Inquiry ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Inquiry ${Messages.NOT_FOUND}`
      );
    }

    if (inquiry.status === Status.RESOLVE) {
      Logger.log(Messages.INQUIRY_ALREADY_RESOLVE);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.INQUIRY_ALREADY_RESOLVE
      );
    }

    await this.inquiryModel.update(
      { status: Status.RESOLVE },
      { where: { id: inquiry } }
    );

    Logger.log(`Inquiry ${Messages.UPDATE_SUCCESS}`);
    return HandleResponse(
      HttpStatus.ACCEPTED,
      ResponseData.SUCCESS,
      `Inquiry ${Messages.UPDATE_SUCCESS}`
    );
  }
}
