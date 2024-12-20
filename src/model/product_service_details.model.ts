import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductServiceModel } from './product_service.model';

@Table({ tableName: 'product_service_details' })
export class ProductServiceDetailsModel extends Model<ProductServiceDetailsModel> {
  @AllowNull(true)
  @MaxLength(255)
  @Column
  service_details?: string;

  @ForeignKey(() => ProductServiceModel)
  @AllowNull(false)
  @Column
  product_service_id: number;

  @BelongsTo(() => ProductServiceModel)
  product_service: ProductServiceModel;
}
