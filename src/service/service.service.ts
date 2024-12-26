import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceModel } from '../model/service.model';
import { SubServiceModel } from '../model/sub_service.model';
import { ServiceDetailsModel } from '../model/service_details.model';
import { ImageModel } from '../model/images.model';
import { HandleResponse } from 'src/libs/services/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { Messages } from 'src/libs/utils/constants/message';
import {
  CreateServiceDto,
  ListOfServiceDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { ServiceDetailType } from 'src/libs/utils/constants/enum';
import { pagination, sorting } from 'src/libs/utils/constants/commonFunctions';
import { Op } from 'sequelize';

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
    const transaction = await this.serviceModel.sequelize.transaction();

    try {
      const createService = await this.serviceModel.create(
        {
          service_name,
          service_description,
        },
        { transaction }
      );

      const servicesId = createService.id;

      if (images) {
        const imageData = {
          service_id: servicesId,
          image1: images.image1,
          image2: images.image2,
          image3: images.image3,
          image4: images.image4,
        };
        await this.imageModel.create(imageData, { transaction });
      }

      if (subServices) {
        const createSubService = subServices.map((subService) => ({
          service_id: servicesId,
          sub_service_title: subService.sub_service_title,
          sub_service_description: subService.sub_service_description,
        }));
        await this.subServiceModel.bulkCreate(createSubService, {
          transaction,
        });
      }

      if (serviceDetails) {
        const createServiceDetail = serviceDetails.map((detail) => {
          if (detail.type === ServiceDetailType.CONSULTING) {
            return {
              service_id: servicesId,
              type: detail.type,
              title: detail.title,
              description: detail.description,
            };
          }
          return {
            service_id: servicesId,
            type: detail.type,
            title: detail.title,
          };
        });

        await this.serviceDetailsModel.bulkCreate(createServiceDetail, {
          transaction,
        });
      }

      await transaction.commit();

      Logger.log(`Service ${Messages.ADD_SUCCESS}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Service ${Messages.ADD_SUCCESS}`,
        { id: servicesId }
      );
    } catch (error) {
      await transaction.rollback();
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

    Logger.log(`Service ${Messages.ADD_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      findService
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

  async listOfService(dto: ListOfServiceDto) {
    const { search, pageSize, page, sortValue, sortKey } = dto;
    const sortQuery = sorting(sortKey, sortValue);

    const whereCondition: any = {
      attributes: ['service_name'],
      order: sortQuery,
      where: {},
    };

    if (search) {
      whereCondition.where[Op.or] = [
        { service_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const paginationResult = await pagination(
      this.serviceModel,
      page,
      pageSize,
      whereCondition,
      'services'
    );

    Logger.log(`Services ${Messages.RETRIEVED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      paginationResult
    );
  }

  async deleteService(service_id: number) {
    const transaction = await this.serviceModel.sequelize.transaction();

    try {
      const findService = await this.serviceModel.findByPk(service_id);

      if (!findService) {
        Logger.error(`Service ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Service${Messages.NOT_FOUND}`
        );
      }

      const servicesId = findService.id;

      await this.subServiceModel.destroy({
        where: { service_id: servicesId },
        transaction,
      });

      await this.serviceDetailsModel.destroy({
        where: { service_id: servicesId },
        transaction,
      });

      await findService.destroy({ transaction });

      Logger.log(`Service ${Messages.DELETED_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        `Service ${Messages.DELETED_SUCCESS}`
      );
    } catch (error) {
      await transaction.rollback();
      Logger.error(error.message || error);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error
      );
    }
  }

  async updateService(serviceId: number, dto: UpdateServiceDto) {
    const {
      service_name,
      service_description,
      images,
      subServices,
      serviceDetails,
    } = dto;
    const transaction = await this.serviceModel.sequelize.transaction();

    try {
      const findService = await this.serviceModel.findByPk(serviceId);
      const servicesId = findService.id;

      if (!findService) {
        Logger.error(`Service ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Service ${Messages.NOT_FOUND}`
        );
      }

      await findService.update(
        {
          service_name,
          service_description,
        },
        { transaction }
      );

      if (images) {
        const imageData = {
          image1: images.image1,
          image2: images.image2,
          image3: images.image3,
          image4: images.image4,
        };

        await this.imageModel.destroy({
          where: { service_id: servicesId },
        });

        await this.imageModel.create(
          { ...imageData, service_id: servicesId },
          { transaction }
        );
      }

      if (subServices) {
        await this.subServiceModel.destroy({
          where: { service_id: servicesId },
        });

        const updateSubService = subServices.map((subService) => ({
          sub_service_title: subService.sub_service_title,
          sub_service_description: subService.sub_service_description,
        }));

        await this.subServiceModel.bulkCreate(updateSubService, {
          transaction,
        });
      }

      if (serviceDetails) {
        await this.serviceDetailsModel.destroy({
          where: { service_id: servicesId },
        });

        const updateServiceDetails = serviceDetails.map((detail) => {
          if (detail.type === ServiceDetailType.CONSULTING) {
            return {
              service_id: servicesId,
              type: detail.type,
              title: detail.title,
              description: detail.description,
            };
          }
          return {
            service_id: servicesId,
            type: detail.type,
            title: detail.title,
          };
        });
        await this.serviceDetailsModel.bulkCreate(updateServiceDetails, {
          transaction,
        });
      }

      await transaction.commit();

      Logger.log(`Service ${Messages.UPDATE_SUCCESS}`);
      return HandleResponse(
        HttpStatus.ACCEPTED,
        ResponseData.SUCCESS,
        `Service ${Messages.UPDATE_SUCCESS}`,
        { id: servicesId }
      );
    } catch (error) {
      await transaction.rollback();
      Logger.error(error.message || error);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error
      );
    }
  }
}
