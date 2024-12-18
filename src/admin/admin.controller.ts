import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  VerifyEmailDto,
} from './dto/create-admin.dto';

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
}
