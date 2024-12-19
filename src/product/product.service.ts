import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from '../model/product.model';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductBenefitModel } from '../model/product_benefit.model';
import { ProductServiceModel } from '../model/product_service.model';
import { ProductServiceDetailsModel } from '../model/product_service_details.model';
import { ImageModel } from '../model/images.model';
import { ProductMethodologyModel } from '../model/product_methodology.model';
import { ProductExpertiseModel } from '../model/product_expertise.model';

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
      expiries,
      images,
    } = createProductDTO;

    const newProduct = await this.productModel.create({
      product_name,
      product_description,
      contact,
    });

    if (images) {
      const imageData = {
        product_id: newProduct.id,
        service_id: 1,
        image1: images.image1 || 'null',
        image2: images.image2 || 'null',
        image3: images.image3 || 'null',
        image4: images.image4 || 'null',
      };
      await this.imageModel.create(imageData);
    }

    if (benefits && benefits.length) {
      const benefitRecords = benefits.map((benefit) => ({
        benefit,
        product_id: newProduct.id,
      }));
      await this.productBenefitModel.bulkCreate(benefitRecords);
    }

    if (services && services.length) {
      for (const service of services) {
        const newService = await this.productServiceModel.create({
          service_type: service.service_type,
          service_detail: service.service_details,
          product_id: newProduct.id,
        });

        console.log('Created service with ID:', newService.id);

        if (
          service.service_details_list &&
          service.service_details_list.length
        ) {
          const serviceDetails = service.service_details_list.map((detail) => ({
            service_id: newService.id,
            service_detail: detail,
          }));
          console.log(serviceDetails);
          await this.serviceDetailModel.bulkCreate(serviceDetails);
        }
      }
    }

    if (methodology && methodology.length) {
      const methodologyRecords = methodology.map((step) => ({
        product_id: newProduct.id,
        product_step: step,
      }));
      await this.productMethodologyModel.bulkCreate(methodologyRecords);
    }

    if (expiries && expiries.length) {
      const expiryRecords = expiries.map((expiry) => ({
        product_id: newProduct.id,
        product_area: expiry.area,
        product_description: expiry.description,
      }));
      await this.productExpertiseModel.bulkCreate(expiryRecords);
    }

    return newProduct;
  }
}
