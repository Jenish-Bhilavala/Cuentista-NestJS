import { MaxLength } from 'class-validator';
import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  HasMany,
  HasOne,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { ProductBenefitModel } from './product_benefit.model';
import { ImageModel } from './images.model';
import { ProductExpertiseModel } from './product_expertise.model';
import { ProductMethodologyModel } from './product_methodology.model';
import { ProductServiceModel } from './product_service.model';

@Table({ tableName: 'product' })
export class ProductModel extends Model<ProductModel> {
  @AllowNull(false)
  @MaxLength(50)
  @Column
  product_name: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  product_description: string;

  @HasMany(() => ProductBenefitModel)
  benefit: ProductBenefitModel[];

  @HasMany(() => ProductServiceModel)
  services: ProductServiceModel[];

  @HasMany(() => ProductMethodologyModel)
  methodologies: ProductMethodologyModel[];

  @HasMany(() => ProductExpertiseModel)
  expertise: ProductExpertiseModel[];

  @HasOne(() => ImageModel)
  imagesDetails: ImageModel;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: 'TIMESTAMP' })
  createdAt: Date;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal(
      'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
    ),
  })
  updatedAt: Date;
}
