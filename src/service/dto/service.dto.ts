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
    description: 'The name of the service',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  service_name: string;

  @ApiProperty({
    description: 'The description of the service',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  service_description: string;

  @ApiProperty({
    description: 'Image details for the product',
    type: Object,
    required: true,
    example: {
      image1: 'image_url_1',
      image2: 'image_url_2',
      image3: 'image_url_3',
      image4: 'image_url_4',
    },
  })
  @IsNotEmpty()
  images: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
  };

  @ApiProperty({
    description: 'Sub-services for the service',
    type: [Object],
    example: [
      {
        sub_service_title: 'SubService 1',
        sub_service_description: 'Description of SubService 1',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  subServices: {
    sub_service_title: string;
    sub_service_description: string;
  }[];

  @ApiProperty({
    description: 'Service details related to the service',
    type: [Object],
    example: [
      {
        type: 'consulting',
        title: 'Consulting Detail',
        description: 'Detailed description of consulting',
      },
      { type: 'ATC', title: 'ATC Detail' },
    ],
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
    description: 'The name of the service',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  service_name: string;

  @ApiProperty({
    description: 'The description of the service',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  service_description: string;

  @ApiProperty({
    description: 'Image details for the product',
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
    description: 'Sub-services for the service',
    type: [Object],
    example: [
      {
        sub_service_title: 'SubService 1',
        sub_service_description: 'Description of SubService 1',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  subServices: {
    sub_service_title: string;
    sub_service_description: string;
  }[];

  @ApiProperty({
    description: 'Service details related to the service',
    type: [Object],
    example: [
      {
        type: 'consulting',
        title: 'Consulting Detail',
        description: 'Detailed description of consulting',
      },
      { type: 'ATC', title: 'ATC Detail' },
    ],
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
