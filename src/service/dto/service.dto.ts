import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsArray,
  IsString,
  IsNumber,
} from 'class-validator';
import { ServiceDetailType } from 'src/libs/utils/constants/enum';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Inbuilt extension',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  service_name: string;

  @ApiProperty({
    example: 'Microsoft Code provide many extension which help while code.',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  service_description: string;

  @ApiProperty({
    example: {
      image1: 'image_url_1',
      image2: 'image_url_2',
      image3: 'image_url_3',
      image4: 'image_url_4',
    },
    type: Object,
    required: true,
  })
  @IsNotEmpty()
  images: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
  };

  @ApiProperty({
    type: [Object],
    example: [
      {
        sub_service_title: 'Microsoft extension',
        sub_service_description:
          'Microsoft code provide extension built by their own',
      },
      {
        sub_service_title: 'Third party extension',
        sub_service_description:
          'Software user also can built their extension and publish them.',
      },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  subServices: {
    sub_service_title: string;
    sub_service_description: string;
  }[];

  @ApiProperty({
    type: [Object],
    example: [
      {
        type: 'consulting',
        title: 'Consulting Detail',
        description: 'Detailed description of consulting',
      },
      { type: 'ATC', title: 'ATC Detail' },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  serviceDetails: {
    type: ServiceDetailType;
    title: string;
    description?: string;
  }[];
}

export class UpdateServiceDto {
  @ApiProperty({
    example: 'Microsoft Code',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  service_name: string;

  @ApiProperty({
    example: 'Microsoft Code provide many extension which help while code.',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  service_description: string;

  @ApiProperty({
    type: Object,
    required: false,
    example: {
      image1: 'image_url_1',
      image2: 'image_url_2',
      image3: 'image_url_3',
      image4: 'image_url_4',
    },
  })
  @IsOptional()
  images: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
  };

  @ApiProperty({
    example: [
      {
        sub_service_title: 'Microsoft extension',
        sub_service_description:
          'Microsoft code provide extension built by their own',
      },
      {
        sub_service_title: 'Third party extension',
        sub_service_description:
          'Software user also can built their extension and publish them.',
      },
    ],
    type: [Object],
    required: false,
  })
  @IsArray()
  @IsOptional()
  subServices: {
    sub_service_title: string;
    sub_service_description: string;
  }[];

  @ApiProperty({
    example: [
      {
        type: ServiceDetailType.CONSULTING,
        title: 'Consulting Detail',
        description: 'Detailed description of consulting',
      },
      { type: ServiceDetailType.BENEFIT, title: 'Benefit Detail' },
      { type: ServiceDetailType.APPROACH, title: 'Approach Detail' },
      { type: ServiceDetailType.ATC, title: 'ATC Detail' },
    ],
    type: [Object],
    required: false,
  })
  @IsArray()
  @IsOptional()
  serviceDetails: {
    type: ServiceDetailType;
    title: string;
    description?: string;
  }[];
}

export class ListOfServiceDto {
  @ApiProperty({
    example: 'Web Development',
    type: 'string',
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
