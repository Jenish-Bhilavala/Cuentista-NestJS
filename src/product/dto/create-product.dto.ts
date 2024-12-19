import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateProductDTO {
  @ApiProperty({
    description: 'The name of the product',
    maxLength: 50,
  })
  @IsNotEmpty()
  @MaxLength(50)
  product_name: string;

  @ApiProperty({
    description: 'The description of the product',
    maxLength: 255,
  })
  @IsNotEmpty()
  @MaxLength(255)
  product_description: string;

  @ApiProperty({
    description: 'Contact details for the product',
    maxLength: 255,
  })
  @IsNotEmpty()
  @MaxLength(255)
  contact: string;

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
  images?: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
  };

  @ApiProperty({
    description: 'List of benefits related to the product',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  benefits: string[];

  @ApiProperty({
    description: 'List of services offered with the product',
    type: [Object],
    example: [
      {
        service_type: 'Service Type 1',
        service_details: 'Detailed description of the service',
        service_details_list: ['Subservice 1', 'Subservice 2'],
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  services: {
    service_type: string;
    service_details: string;
    service_details_list: string[];
  }[];

  @ApiProperty({
    description: 'List of methodologies associated with the product',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  methodology: string[];

  @ApiProperty({
    description: 'List of expiry areas and descriptions',
    type: [Object],
    required: false,
    example: [
      { area: 'Area 1', description: 'Expiry description 1' },
      { area: 'Area 2', description: 'Expiry description 2' },
    ],
  })
  @IsArray()
  @IsOptional()
  expiries: {
    area: string;
    description: string;
  }[];
}
