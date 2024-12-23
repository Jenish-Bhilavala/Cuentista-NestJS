import { Injectable, HttpStatus, Logger } from '@nestjs/common';
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

      Logger.log(`Service ${Messages.ADD_SUCCESS}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Service ${Messages.ADD_SUCCESS}`,
        { id: newService.id }
      );
    } catch (error) {
      Logger.error(error.message || error);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error
      );
    }
  }

  async viewService(serviceId: number) {
    const findService = await this.serviceModel.findByPk(serviceId, {
      include: [
        {
          model: this.subServiceModel,
          as: 'subServices',
          attributes: { exclude: ['service_id'] },
        },
        {
          model: this.serviceDetailsModel,
          as: 'serviceDetails',
          attributes: { exclude: ['service_id'] },
        },
      ],
    });

    if (!findService) {
      Logger.error(`Service ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `Service ${Messages.NOT_FOUND}`
      );
    }

    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      findService
    );
  }

  async deleteService(service_id: number) {
    const findService = await this.serviceModel.findByPk(service_id);

    if (!findService) {
      Logger.error(`Service ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Service${Messages.NOT_FOUND}`
      );
    }

    await findService.destroy();

    Logger.log(`Service ${Messages.DELETED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Service ${Messages.DELETED_SUCCESS}`
    );
  }

  async getListOfService() {
    const findService = await this.serviceModel.findAll({
      attributes: ['id', 'service_name'],
    });

    if (findService.length === 0) {
      Logger.error(`Service ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Service ${Messages.NOT_FOUND}`
      );
    }

    Logger.log(`Service ${Messages.RETRIEVED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      findService
    );
  }
}
