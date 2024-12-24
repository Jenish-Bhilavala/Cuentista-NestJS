import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InquiryModule } from './inquiry/inquiry.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import * as dotenv from 'dotenv';
import { InquiryModel } from './model/inquiry.model';
import { AdminModel } from './model/admin.model';
import { OTPModel } from './model/otp.model';
import { ImageModel } from './model/images.model';
import { ProductModel } from './model/product.model';
import { ProductServiceModel } from './model/product_service.model';
import { ProductServiceDetailsModel } from './model/product_service_details.model';
import { ProductBenefitModel } from './model/product_benefit.model';
import { ProductExpertiseModel } from './model/product_expertise.model';
import { ProductMethodologyModel } from './model/product_methodology.model';
dotenv.config();

const config: any = {
  dialect: 'mysql',
  autoLoadModels: true,
  models: [
    InquiryModel,
    AdminModel,
    OTPModel,
    ImageModel,
    ProductModel,
    ProductServiceModel,
    ProductServiceDetailsModel,
    ProductBenefitModel,
    ProductExpertiseModel,
    ProductMethodologyModel,
  ],
  define: {
    timestamps: false,
  },
};
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'uploads'),
      serveRoot: '/uploads',
    }),

    SequelizeModule.forRoot({
      ...config,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
    }),
    InquiryModule,
    AdminModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
