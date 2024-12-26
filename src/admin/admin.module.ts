import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModel } from '../model/admin.model';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { OTPModel } from 'src/model/otp.model';
dotenv.config();

@Module({
  imports: [
    SequelizeModule.forFeature([AdminModel, OTPModel]),
    JwtModule.register({
      secret: process.env.MY_SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRE_IN },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
