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
import { ServiceModel } from './service.model';

@Table({ tableName: 'images' })
export class ImageModel extends Model<ImageModel> {
  @AllowNull(false)
  @MaxLength(255)
  @Column
  image1: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  image2: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  image3: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  image4: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(true)
  @Column
  product_id: number;

  @ForeignKey(() => ServiceModel)
  @AllowNull(true)
  @Column
  service_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
