import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';

@Table({ tableName: 'product_expertise' })
export class ProductExpertiseModel extends Model<ProductExpertiseModel> {
  @AllowNull(true)
  @MaxLength(255)
  @Column
  product_area?: string;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  product_description?: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
