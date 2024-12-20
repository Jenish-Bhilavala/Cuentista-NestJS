import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from '../model/product.model';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductBenefitModel } from '../model/product_benefit.model';
import { ProductServiceModel } from '../model/product_service.model';
import { ProductServiceDetailsModel } from '../model/product_service_details.model';
import { ImageModel } from '../model/images.model';
import { ProductMethodologyModel } from '../model/product_methodology.model';
import { ProductExpertiseModel } from '../model/product_expertise.model';
import { HandleResponse } from 'src/libs/services/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { Messages } from 'src/libs/utils/constants/message';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: typeof ProductModel,
    @InjectModel(ProductBenefitModel)
    private readonly productBenefitModel: typeof ProductBenefitModel,
    @InjectModel(ProductServiceModel)
    private readonly productServiceModel: typeof ProductServiceModel,
    @InjectModel(ProductServiceDetailsModel)
    private readonly serviceDetailModel: typeof ProductServiceDetailsModel,
    @InjectModel(ImageModel) private readonly imageModel: typeof ImageModel,
    @InjectModel(ProductMethodologyModel)
    private readonly productMethodologyModel: typeof ProductMethodologyModel,
    @InjectModel(ProductExpertiseModel)
    private readonly productExpertiseModel: typeof ProductExpertiseModel
  ) {}

  async createProduct(createProductDTO: CreateProductDTO) {
    const {
      product_name,
      product_description,
      contact,
      benefits,
      services,
      methodology,
      expertise,
      images,
    } = createProductDTO;
    try {
      const newProduct = await this.productModel.create({
        product_name,
        product_description,
        contact,
      });

      if (images) {
        const imageData = {
          product_id: newProduct.id,
          image1: images.image1,
          image2: images.image2,
          image3: images.image3,
          image4: images.image4,
        };
        await this.imageModel.create(imageData);
      }

      if (benefits?.length) {
        const benefitRecords = benefits.map((benefit) => ({
          benefit,
          product_id: newProduct.id,
        }));
        await this.productBenefitModel.bulkCreate(benefitRecords);
      }

      if (services?.length) {
        for (const service of services) {
          const newService = await this.productServiceModel.create({
            service_type: service.service_type,
            service_detail: service.service_details,
            product_id: newProduct.id,
          });

          if (service.service_details_list?.length) {
            const serviceDetails = service.service_details_list.map(
              (detail) => ({
                product_service_id: newService.id,
                service_details: detail,
              })
            );
            await this.serviceDetailModel.bulkCreate(serviceDetails);
          }
        }
      }

      if (methodology?.length) {
        const methodologyRecords = methodology.map((step) => ({
          product_id: newProduct.id,
          product_step: step,
        }));
        await this.productMethodologyModel.bulkCreate(methodologyRecords);
      }

      if (expertise?.length) {
        const expertiseRecords = expertise.map((expertise) => ({
          product_id: newProduct.id,
          product_area: expertise.area,
          product_description: expertise.description,
        }));
        await this.productExpertiseModel.bulkCreate(expertiseRecords);
      }
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Product ${Messages.ADD_SUCCESS}`,
        { id: newProduct.id }
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
