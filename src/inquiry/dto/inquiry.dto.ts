import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class InquiryDto {
  @ApiProperty({
    example: 'John',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '6351320744',
    type: 'string',
    format: 'string',
    required: true,
  })
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: 'Inquiry content',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsNotEmpty()
  message: string;
}
