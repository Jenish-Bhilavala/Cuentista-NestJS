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

@Table({ tableName: 'product_benefit' })
export class ProductBenefitModel extends Model<ProductBenefitModel> {
  @AllowNull(false)
  @MaxLength(255)
  @Column
  benefit: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
