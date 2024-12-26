import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { ProductServiceModel } from './product_service.model';

@Table({ tableName: 'product_service_details' })
export class ProductServiceDetailsModel extends Model<ProductServiceDetailsModel> {
  @ForeignKey(() => ProductServiceModel)
  @AllowNull(false)
  @Column
  product_service_id: number;

  @ForeignKey(() => ProductServiceModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  service_details?: string;

  @BelongsTo(() => ProductServiceModel)
  product_service: ProductServiceModel;

  @BelongsTo(() => ProductServiceModel)
  product: ProductServiceModel;

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
