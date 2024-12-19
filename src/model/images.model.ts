import { MaxLength } from 'class-validator';
import {
  Table,
  Model,
  AllowNull,
  Column,
  ForeignKey,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';

@Table({ tableName: 'image' })
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
  @AllowNull(false)
  @Column
  product_id: number;
}
