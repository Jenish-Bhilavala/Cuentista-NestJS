import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InquiryModule } from './inquiry/inquiry.module';
import { AdminModule } from './admin/admin.module';
import * as dotenv from 'dotenv';
import { InquiryModel } from './model/inquiry.model';
import { AdminModel } from './model/admin.model';
import { OTPModel } from './model/otp.model';
dotenv.config();

const config: any = {
  dialect: 'mysql',
  autoLoadModels: true,
  models: [InquiryModel, AdminModel, OTPModel],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
