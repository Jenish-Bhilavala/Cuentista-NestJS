import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import upload from '../libs/helpers/multer';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  VerifyEmailDto,
} from './dto/create-admin.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async adminLogin(@Body() loginDto: LoginDto) {
    return await this.adminService.adminLogin(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/verifyEmail')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.adminService.verifyEmail(verifyEmailDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.adminService.forgotPassword(forgotPasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/changePassword')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.adminService.changePassword(changePasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('fileUploads')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 4, upload))
  fileUpload(@Body() dto: FileUploadDto, @UploadedFiles() files: any) {
    return this.adminService.fileUpload(files);
  }
}
