import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceModel } from '../model/service.model';
import { SubServiceModel } from '../model/sub_service.model';
import { ServiceDetailsModel } from '../model/service_details.model';
import { ImageModel } from '../model/images.model';
import { HandleResponse } from 'src/libs/services/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { Messages } from 'src/libs/utils/constants/message';
import { CreateServiceDto } from './dto/service.dto';
import { ServiceDetailType } from 'src/libs/utils/constants/enum';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(ServiceModel)
    private readonly serviceModel: typeof ServiceModel,
    @InjectModel(SubServiceModel)
    private readonly subServiceModel: typeof SubServiceModel,
    @InjectModel(ServiceDetailsModel)
    private readonly serviceDetailsModel: typeof ServiceDetailsModel,
    @InjectModel(ImageModel)
    private readonly imageModel: typeof ImageModel
  ) {}

  async addService(dto: CreateServiceDto) {
    const {
      service_name,
      service_description,
      images,
      subServices,
      serviceDetails,
    } = dto;

    try {
      const newService = await this.serviceModel.create({
        service_name,
        service_description,
      });

      if (images) {
        const imageData = {
          service_id: newService.id,
          image1: images.image1,
          image2: images.image2,
          image3: images.image3,
          image4: images.image4,
        };
        await this.imageModel.create(imageData);
      }

      if (subServices?.length) {
        const subServiceRecords = subServices.map((subService) => ({
          service_id: newService.id,
          sub_service_title: subService.sub_service_title,
          sub_service_description: subService.sub_service_description,
        }));
        await this.subServiceModel.bulkCreate(subServiceRecords);
      }

      if (serviceDetails?.length) {
        const serviceDetailRecords = serviceDetails.map((detail) => {
          if (detail.type === ServiceDetailType.CONSULTING) {
            return {
              service_id: newService.id,
              type: detail.type,
              title: detail.title,
              description: detail.description,
            };
          }
          return {
            service_id: newService.id,
            type: detail.type,
            title: detail.title,
          };
        });

        await this.serviceDetailsModel.bulkCreate(serviceDetailRecords);
      }

      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Service ${Messages.ADD_SUCCESS}`,
        { id: newService.id }
      );
    } catch (error) {
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error
      );
    }
  }
}
