import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class AddInquiryDto {
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

export class ListOfInquiryDto {
  @ApiProperty({
    example: 'john',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsOptional()
  search: string;

  @ApiProperty({
    example: 5,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pageSize: number;

  @ApiProperty({
    example: 1,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    example: 'desc',
    type: 'string',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsString()
  @IsOptional()
  sortValue: string;

  @ApiProperty({
    example: 'id',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortKey: string;
}
