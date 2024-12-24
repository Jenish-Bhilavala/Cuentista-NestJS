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

  async createProduct(dto: CreateProductDto) {
    const {
      product_name,
      product_description,
      contact,
      benefits,
      services,
      methodology,
      expertise,
      images,
    } = dto;

    const transaction = await this.productModel.sequelize.transaction();
    try {
      const createProduct = await this.productModel.create(
        {
          product_name,
          product_description,
          contact,
        },
        { transaction }
      );

      const ProductsId = createProduct.id;

      if (images) {
        const imageData = {
          product_id: ProductsId,
          image1: images.image1,
          image2: images.image2,
          image3: images.image3,
          image4: images.image4,
        };
        await this.imageModel.create(imageData, { transaction });
      }

      if (benefits) {
        const createBenefits = benefits.map((benefit) => ({
          benefit,
          product_id: ProductsId,
        }));
        await this.productBenefitModel.bulkCreate(createBenefits, {
          transaction,
        });
      }

      if (services) {
        for (const service of services) {
          const createServices = await this.productServiceModel.create(
            {
              service_type: service.service_type,
              service_detail: service.service_details,
              product_id: ProductsId,
            },
            { transaction }
          );

          if (service.service_details_list) {
            const createServiceDetails = service.service_details_list.map(
              (detail) => ({
                product_service_id: createServices.id,
                service_details: detail,
              })
            );
            await this.serviceDetailModel.bulkCreate(createServiceDetails, {
              transaction,
            });
          }
        }
      }

      if (methodology) {
        const createMethodology = methodology.map((step) => ({
          product_id: ProductsId,
          product_step: step,
        }));
        await this.productMethodologyModel.bulkCreate(createMethodology, {
          transaction,
        });
      }

      if (expertise) {
        const createExpertise = expertise.map((expertise) => ({
          product_id: ProductsId,
          product_area: expertise.area,
          product_description: expertise.description,
        }));
        await this.productExpertiseModel.bulkCreate(createExpertise, {
          transaction,
        });
      }

      await transaction.commit();

      Logger.log(`Product ${Messages.ADD_SUCCESS}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Product ${Messages.ADD_SUCCESS}`,
        { id: ProductsId }
      );
    } catch (error) {
      await transaction.rollback();
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

    Logger.log(`Product ${Messages.RETRIEVED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      findProduct
    );
  }

  async listOfProduct(dto: ListOfProductDto) {
    const { search, pageSize, page, sortValue, sortKey } = dto;
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

    Logger.log(`Products ${Messages.RETRIEVED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      paginationResult
    );
  }

  async getListOfProduct() {
    const findProduct = await this.productModel.findAll({
      attributes: ['id', 'product_name'],
    });

    if (findProduct.length === 0) {
      Logger.error(`Product ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Product ${Messages.NOT_FOUND}`
      );
    }

    Logger.log(`Product ${Messages.RETRIEVED_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      undefined,
      findProduct
    );
  }

  async updateProduct(productId: number, dto: UpdateProductDTO) {
    const {
      product_name,
      product_description,
      contact,
      benefits,
      services,
      methodology,
      expertise,
      images,
    } = dto;

    const findProduct = await this.productModel.findByPk(productId);
    const productsId = findProduct.id;

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
        where: { product_id: productsId },
      });

      if (existingImages) {
        await existingImages.update(imageData);
      } else {
        await this.imageModel.create({
          ...imageData,
          product_id: productsId,
        });
      }
    }

    if (benefits) {
      await this.productBenefitModel.destroy({
        where: { product_id: productsId },
      });

      const benefitRecords = benefits.map((benefit) => ({
        benefit,
        product_id: productsId,
      }));

      await this.productBenefitModel.bulkCreate(benefitRecords);
    }

    if (services) {
      await this.productServiceModel.destroy({
        where: { product_id: productsId },
      });

      for (const service of services) {
        const updateService = await this.productServiceModel.create({
          service_type: service.service_type,
          service_detail: service.service_details,
          product_id: productsId,
        });

        if (service.service_details_list?.length) {
          const createServiceDetails = service.service_details_list.map(
            (detail) => ({
              product_service_id: updateService.id,
              service_details: detail,
            })
          );

          await this.serviceDetailModel.bulkCreate(createServiceDetails);
        }
      }
    }

    if (methodology) {
      await this.productMethodologyModel.destroy({
        where: { product_id: productsId },
      });

      const updateMethodology = methodology.map((step) => ({
        product_id: productsId,
        product_step: step,
      }));

      await this.productMethodologyModel.bulkCreate(updateMethodology);
    }

    if (expertise) {
      await this.productExpertiseModel.destroy({
        where: { product_id: productsId },
      });

      const updateExpertise = expertise.map((expertise) => ({
        product_id: productsId,
        product_area: expertise.area,
        product_description: expertise.description,
      }));

      await this.productExpertiseModel.bulkCreate(updateExpertise);
    }

    Logger.log(`Product ${Messages.UPDATE_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Product ${Messages.UPDATE_SUCCESS}`,
      { id: productsId }
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
