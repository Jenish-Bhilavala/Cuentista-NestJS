import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from '../model/product.model';
import { CreateProductDto, ListOfProductDto } from './dto/create-product.dto';
import { ProductBenefitModel } from '../model/product_benefit.model';
import { ProductServiceModel } from '../model/product_service.model';
import { ProductServiceDetailsModel } from '../model/product_service_details.model';
import { ImageModel } from '../model/images.model';
import { ProductMethodologyModel } from '../model/product_methodology.model';
import { ProductExpertiseModel } from '../model/product_expertise.model';
import { HandleResponse } from 'src/libs/services/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { Messages } from 'src/libs/utils/constants/message';
import { UpdateProductDTO } from './dto/update-product.dto';
import { pagination, sorting } from 'src/libs/utils/constants/commonFunctions';
import { Op } from 'sequelize';

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

  async createProduct(createProductDTO: CreateProductDto) {
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

  async viewProduct(productId: number) {
    const findProduct = await this.productModel.findByPk(productId, {
      include: [
        {
          model: this.productServiceModel,
          as: 'services',
          attributes: { exclude: ['id', 'product_id'] },
          include: [
            {
              model: this.serviceDetailModel,
              as: 'serviceDetails',
              attributes: { exclude: ['product_service_id'] },
            },
          ],
        },
        {
          model: this.imageModel,
          as: 'imagesDetails',
          attributes: { exclude: ['service_id', 'product_id'] },
        },
        {
          model: this.productBenefitModel,
          as: 'benefit',
          attributes: { exclude: ['product_id'] },
        },
        {
          model: this.productMethodologyModel,
          as: 'methodologies',
          attributes: { exclude: ['product_id'] },
        },
        {
          model: this.productExpertiseModel,
          as: 'expertise',
          attributes: { exclude: ['product_id'] },
        },
      ],
    });

    if (!findProduct) {
      Logger.error(`Product ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Product ${Messages.NOT_FOUND}`
      );
    }

    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      findProduct
    );
  }

  async listOfProduct(listOfProductDTO: ListOfProductDto) {
    const { search, pageSize, page, sortValue, sortKey } = listOfProductDTO;
    const sortQuery = sorting(sortKey, sortValue);

    const whereCondition: any = {
      attributes: ['product_name'],
      order: sortQuery,
      where: {},
    };

    if (search) {
      whereCondition.where[Op.or] = [
        { product_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const paginationResult = await pagination(
      this.productModel,
      page,
      pageSize,
      whereCondition,
      'products'
    );

    if (paginationResult.products && paginationResult.products.length <= 0) {
      Logger.error(`Products ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Products ${Messages.NOT_FOUND}`
      );
    }

    Logger.log(`Products ${Messages.RETRIEVED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      paginationResult
    );
  }

  async getListOfProduct() {
    const findProduct = await this.productModel.findAll();

    if (findProduct.length === 0) {
      Logger.error(`Product ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Product ${Messages.NOT_FOUND}`
      );
    }

    const productList = findProduct.map((product) => ({
      productId: product.id,
      productName: product.product_name,
    }));

    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      productList
    );
  }

  async updateProduct(productId: number, updateProductDTO: UpdateProductDTO) {
    const {
      product_name,
      product_description,
      contact,
      benefits,
      services,
      methodology,
      expertise,
      images,
    } = updateProductDTO;

    const findProduct = await this.productModel.findByPk(productId);

    if (!findProduct) {
      Logger.error(`Product ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Product ${Messages.NOT_FOUND}`
      );
    }

    await findProduct.update({
      product_name,
      product_description,
      contact,
    });

    if (images) {
      const imageData = {
        image1: images.image1,
        image2: images.image2,
        image3: images.image3,
        image4: images.image4,
      };

      const existingImages = await this.imageModel.findOne({
        where: { product_id: findProduct.id },
      });

      if (existingImages) {
        await existingImages.update(imageData);
      } else {
        await this.imageModel.create({
          ...imageData,
          product_id: findProduct.id,
        });
      }
    }

    if (benefits?.length) {
      await this.productBenefitModel.destroy({
        where: { product_id: findProduct.id },
      });

      const benefitRecords = benefits.map((benefit) => ({
        benefit,
        product_id: findProduct.id,
      }));

      await this.productBenefitModel.bulkCreate(benefitRecords);
    }

    if (services?.length) {
      await this.productServiceModel.destroy({
        where: { product_id: findProduct.id },
      });

      for (const service of services) {
        const newService = await this.productServiceModel.create({
          service_type: service.service_type,
          service_detail: service.service_details,
          product_id: findProduct.id,
        });

        if (service.service_details_list?.length) {
          const serviceDetails = service.service_details_list.map((detail) => ({
            product_service_id: newService.id,
            service_details: detail,
          }));

          await this.serviceDetailModel.bulkCreate(serviceDetails);
        }
      }
    }

    if (methodology?.length) {
      await this.productMethodologyModel.destroy({
        where: { product_id: findProduct.id },
      });

      const methodologyRecords = methodology.map((step) => ({
        product_id: findProduct.id,
        product_step: step,
      }));

      await this.productMethodologyModel.bulkCreate(methodologyRecords);
    }

    if (expertise?.length) {
      await this.productExpertiseModel.destroy({
        where: { product_id: findProduct.id },
      });

      const expertiseRecords = expertise.map((expertise) => ({
        product_id: findProduct.id,
        product_area: expertise.area,
        product_description: expertise.description,
      }));

      await this.productExpertiseModel.bulkCreate(expertiseRecords);
    }

    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Product ${Messages.UPDATE_SUCCESS}`,
      { id: findProduct.id }
    );
  }

  async deleteProduct(productId: number) {
    const findProduct = await this.productModel.findByPk(productId);

    if (!findProduct) {
      Logger.error(`Product ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Product ${Messages.NOT_FOUND}`
      );
    }

    await findProduct.destroy();

    Logger.log(`Product ${Messages.DELETED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Product ${Messages.DELETED_SUCCESS}`
    );
  }
}
