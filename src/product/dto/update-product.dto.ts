import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateProductDTO {
  @ApiProperty({
    example: 'Microsoft Code',
    type: 'string',
    required: false,
  })
  @IsOptional()
  product_name: string;

  @ApiProperty({
    example: 'microsoft365@gmail.com',
    type: 'string',
    required: true,
  })
  @IsOptional()
  product_description: string;

  @ApiProperty({
    example: 'microsoft365@gmail.com',
    type: 'string',
    required: true,
  })
  @IsOptional()
  contact: string;

  @ApiProperty({
    example: {
      image1: 'image_url_1',
      image2: 'image_url_2',
      image3: 'image_url_3',
      image4: 'image_url_4',
    },
    type: Object,
    required: false,
  })
  @IsOptional()
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
