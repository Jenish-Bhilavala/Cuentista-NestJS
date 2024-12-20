import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';
import { ProductServiceDetailsModel } from './product_service_details.model';

@Table({ tableName: 'product_service' })
export class ProductServiceModel extends Model<ProductServiceModel> {
  @AllowNull(true)
  @MaxLength(255)
  @Column
  service_type?: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  service_detail?: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @HasMany(() => ProductServiceDetailsModel)
  serviceDetails: ProductServiceDetailsModel[];
}
