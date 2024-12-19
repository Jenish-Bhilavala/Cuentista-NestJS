import { MaxLength } from 'class-validator';
import {
  AllowNull,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';

@Table({ tableName: 'product_methodology' })
export class ProductMethodologyModel extends Model<ProductMethodologyModel> {
  @AllowNull(true)
  @MaxLength(255)
  @Column
  product_step?: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;
}
