import {
  Table,
  Model,
  AllowNull,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  Sequelize,
} from 'sequelize-typescript';
import { ServiceModel } from './service.model';
import { ServiceDetailType } from '../libs/utils/constants/enum';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'service_details' })
export class ServiceDetailsModel extends Model<ServiceDetailsModel> {
  @ForeignKey(() => ServiceModel)
  @AllowNull(false)
  @Column
  service_id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.ENUM(
      ServiceDetailType.APPROACH,
      ServiceDetailType.ATC,
      ServiceDetailType.BENEFIT,
      ServiceDetailType.CONSULTING
    ),
  })
  type: string;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(true)
  @Column
  description: string;

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
