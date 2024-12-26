import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';
import { ProductServiceDetailsModel } from './product_service_details.model';

@Table({ tableName: 'product_service' })
export class ProductServiceModel extends Model<ProductServiceModel> {
  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  service_type?: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  service_detail?: string;

  @HasMany(() => ProductServiceDetailsModel)
  serviceDetails: ProductServiceDetailsModel[];

  @BelongsTo(() => ProductModel)
  product: ProductModel;

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
