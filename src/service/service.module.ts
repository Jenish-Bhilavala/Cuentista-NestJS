import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceModel } from 'src/model/service.model';
import { SubServiceModel } from 'src/model/sub_service.model';
import { ServiceDetailsModel } from 'src/model/service_details.model';
import { ImageModel } from 'src/model/images.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ServiceModel,
      SubServiceModel,
      ServiceDetailsModel,
      ImageModel,
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
