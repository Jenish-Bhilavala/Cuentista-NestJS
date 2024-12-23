import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsArray,
  IsEnum,
  IsString,
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
