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

  async adminLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
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

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email } = verifyEmailDto;
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
      createdAt: new Date(),
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email, otp, newPassword, confirmPassword } = forgotPasswordDto;

    const findAdmin = await this.adminModel.findOne({ where: { email } });

    if (!findAdmin) {
      Logger.error(`Admin ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Admin ${Messages.NOT_FOUND}`
      );
    }

    const findOtp = await this.otpModel.findOne({ where: { email, otp } });

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
      Logger.error(Messages.OTP_EXPIRED);
      await this.otpModel.destroy({ where: { otp } });
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.OTP_EXPIRED
      );
    }

    if (newPassword !== confirmPassword) {
      Logger.error(Messages.PASSWORD_MUST_BE_SAME);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.PASSWORD_MUST_BE_SAME
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
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Password ${Messages.UPDATE_SUCCESS}`
    );
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, currentPassword, newPassword, confirmPassword } =
      changePasswordDto;

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

    if (newPassword !== confirmPassword) {
      Logger.error(Messages.PASSWORD_MUST_BE_SAME);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.PASSWORD_MUST_BE_SAME
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
      if (!files || files.length === 0) {
        Logger.log(Messages.FILES_NOT_SELECTED);
        return HandleResponse(
          HttpStatus.BAD_REQUEST,
          ResponseData.ERROR,
          Messages.FILES_NOT_SELECTED
        );
      }

      if (files.length > 4) {
        Logger.log(Messages.MAX_FILE);
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
        const fileName = file.filename;
        const fileUrl = `/uploads/${fileName}`;
        result.push(fileUrl);
      }

      if (result.length > 0) {
        Logger.log(`Files ${Messages.ADD_SUCCESS}`);
        return HandleResponse(
          HttpStatus.CREATED,
          ResponseData.SUCCESS,
          `Files ${Messages.ADD_SUCCESS}`,
          result
        );
      } else {
        Logger.log(`Files ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Files ${Messages.NOT_FOUND}`
        );
      }
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
