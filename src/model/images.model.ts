import { MaxLength } from 'class-validator';
import {
  Table,
  Model,
  AllowNull,
  Column,
  ForeignKey,
  BelongsTo,
  Sequelize,
  Default,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';
import { ServiceModel } from './service.model';

@Table({ tableName: 'images' })
export class ImageModel extends Model<ImageModel> {
  @ForeignKey(() => ProductModel)
  @AllowNull(true)
  @Column
  product_id: number;

  @ForeignKey(() => ServiceModel)
  @AllowNull(true)
  @Column
  service_id: number;

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

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @BelongsTo(() => ServiceModel)
  service: ServiceModel;

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
