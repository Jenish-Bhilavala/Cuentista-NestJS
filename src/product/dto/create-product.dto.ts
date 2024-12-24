import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Microsoft Code',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  product_name: string;

  @ApiProperty({
    example:
      'Microsoft Code is advance coding tool that help developer to write code.',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  product_description: string;

  @ApiProperty({
    example: 'microsoft365@gmail.com',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  contact: string;

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
    example: ['Fast and readable code', 'Code suggestion and snippet'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits: string[];

  @ApiProperty({
    required: false,
    type: [Object],
    example: [
      {
        service_type: 'Coding platform',
        service_details: 'This provides developer to write code free of cost.',
        service_details_list: ['Free to use', 'Provide free extension.'],
      },
    ],
  })
  @IsArray()
  @IsOptional()
  services: {
    service_type: string;
    service_details: string;
    service_details_list: string[];
  }[];

  @ApiProperty({
    example: ['Easy to use', 'User friendly.'],
    type: 'string',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  methodology: string[];

  @ApiProperty({
    type: [Object],
    required: false,
    example: [
      { area: 'AI', description: 'This platform is in build AI.' },
      { area: 'Code snippet', description: 'Provide many in build code.' },
    ],
  })
  @IsArray()
  @IsOptional()
  expertise: {
    area: string;
    description: string;
  }[];
}

export class ListOfProductDto {
  @ApiProperty({
    example: 'Refrigerator Freezer',
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
