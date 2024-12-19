import { MaxLength } from 'class-validator';
import {
  Table,
  Model,
  AllowNull,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';

@Table({ tableName: 'images' })
export class ImageModel extends Model<ImageModel> {
  @AllowNull(true)
  @MaxLength(255)
  @Column
  image1: string;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  image2: string;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  image3: string;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  image4: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  service_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
