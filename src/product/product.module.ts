import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductModel } from 'src/model/product.model';
import { ProductBenefitModel } from 'src/model/product_benefit.model';
import { ProductServiceModel } from 'src/model/product_service.model';
import { ProductServiceDetailsModel } from 'src/model/product_service_details.model';
import { ImageModel } from 'src/model/images.model';
import { ProductMethodologyModel } from 'src/model/product_methodology.model';
import { ProductExpertiseModel } from 'src/model/product_expertise.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductModel,
      ProductBenefitModel,
      ProductServiceModel,
      ProductServiceDetailsModel,
      ImageModel,
      ProductMethodologyModel,
      ProductExpertiseModel,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
