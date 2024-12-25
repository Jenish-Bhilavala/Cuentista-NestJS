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
import { ProductModel } from './product.model';

@Table({ tableName: 'product_benefit' })
export class ProductBenefitModel extends Model<ProductBenefitModel> {
  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  benefit?: string;

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
