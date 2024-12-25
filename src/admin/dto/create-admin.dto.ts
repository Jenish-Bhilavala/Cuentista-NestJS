export class CreateAdminDto {}
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Match } from 'src/libs/utils/constants/match.decorator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Admin@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    format: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 123,
    type: 'number',
    format: 'number',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  otp: number;

  @ApiProperty({
    example: 'ABC@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
    message: 'Your password too weak',
  })
  newPassword: string;

  @ApiProperty({
    example: 'ABC@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @Match('newPassword', { message: 'Your confirm Password is not match.' })
  @IsNotEmpty()
  confirmPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    format: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Admin@1234',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: 'Admin@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
    message:
      'Password must contain one capital latter and at least 8 character long',
  })
  newPassword: string;

  @ApiProperty({
    example: 'Admin@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @Match('newPassword', { message: 'Your confirm Password is not match.' })
  @IsNotEmpty()
  confirmPassword: string;
}
