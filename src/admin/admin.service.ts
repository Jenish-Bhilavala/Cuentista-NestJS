import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { AdminModel } from '../model/admin.model';
import { OTPModel } from 'src/model/otp.model';
import { Messages } from 'src/libs/utils/constants/message';
import { HandleResponse } from 'src/libs/services/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  VerifyEmailDto,
} from './dto/create-admin.dto';
import { emailSend, sendOtp } from 'src/libs/helpers/mail';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminModel) private readonly adminModel: typeof AdminModel,
    @InjectModel(OTPModel) private readonly otpModel: typeof OTPModel,
    private readonly jwtService: JwtService
  ) {}

  async adminLogin(dto: LoginDto) {
    const { email, password } = dto;
    const findAdmin = await this.adminModel.findOne({ where: { email } });

    if (!findAdmin) {
      Logger.error(`Admin ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `Admin ${Messages.NOT_FOUND}`
      );
    }

    const isPasswordValid = await bcrypt.compare(password, findAdmin.password);

    if (!isPasswordValid) {
      Logger.error(Messages.CREDENTIAL_NOT_MATCH);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.CREDENTIAL_NOT_MATCH
      );
    }

    const token = await this.jwtService.signAsync({
      id: findAdmin.id,
      email: findAdmin.email,
    });

    Logger.log(Messages.LOGIN_SUCCESS);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      Messages.LOGIN_SUCCESS,
      { token }
    );
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { email } = dto;
    const findAdmin = await this.adminModel.findOne({ where: { email } });

    if (!findAdmin) {
      Logger.error(`Admin ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Admin ${Messages.NOT_FOUND}`
      );
    }

    const otp = sendOtp();
    const sendMail = { email, otp };

    await OTPModel.create({
      email: email,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await emailSend(sendMail);

    Logger.log(`OTP ${Messages.SEND_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `OTP ${Messages.SEND_SUCCESS}`,
      { otp }
    );
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email, otp, newPassword } = dto;
    const findAdmin = await this.adminModel.findOne({ where: { email } });

    if (!findAdmin) {
      Logger.error(`Admin ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Admin ${Messages.NOT_FOUND}`
      );
    }

    const findOtp = await this.otpModel.findOne({ where: { otp } });

    if (!findOtp) {
      Logger.error(Messages.OTP_NOT_MATCH);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        Messages.OTP_NOT_MATCH
      );
    }

    const currentTime = new Date();

    if (findOtp.expiresAt < currentTime) {
      await this.otpModel.destroy({ where: { otp } });
      Logger.error(Messages.OTP_EXPIRED);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.OTP_EXPIRED
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.adminModel.update(
      { password: hashedPassword },
      { where: { email } }
    );

    await this.otpModel.destroy({ where: { otp } });

    Logger.log(`Password ${Messages.UPDATE_SUCCESS}`);
    return HandleResponse(
      HttpStatus.CREATED,
      ResponseData.SUCCESS,
      `Password ${Messages.UPDATE_SUCCESS}`
    );
  }

  async changePassword(dto: ChangePasswordDto) {
    const { email, currentPassword, newPassword } = dto;
    const findAdmin = await this.adminModel.findOne({ where: { email } });

    if (!findAdmin) {
      Logger.error(`Admin ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Admin ${Messages.NOT_FOUND}`
      );
    }

    const comparePassword = await bcrypt.compare(
      currentPassword,
      findAdmin.password
    );

    if (!comparePassword) {
      Logger.error(Messages.CREDENTIAL_NOT_MATCH);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.CREDENTIAL_NOT_MATCH
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await findAdmin.update({ password: hashedPassword });

    Logger.log(`Your password ${Messages.UPDATE_SUCCESS}`);
    return HandleResponse(
      HttpStatus.ACCEPTED,
      ResponseData.SUCCESS,
      `Your password ${Messages.UPDATE_SUCCESS}`
    );
  }

  async fileUpload(files: Express.Multer.File[]) {
    try {
      if (!files || files.length !== 4) {
        return HandleResponse(
          HttpStatus.BAD_REQUEST,
          ResponseData.ERROR,
          Messages.MAX_FILE
        );
      }

      const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const result: string[] = [];

      for (const file of files) {
        const fileUrl = file.filename;
        result.push(fileUrl);
      }

      Logger.log(`Files ${Messages.ADD_SUCCESS}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Files ${Messages.ADD_SUCCESS}`,
        result
      );
    } catch (error) {
      Logger.error(error.message || error);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error
      );
    }
  }
}
