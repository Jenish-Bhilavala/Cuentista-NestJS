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
import { ServiceModel } from './service.model';
import { MaxLength } from 'class-validator';

@Table({ tableName: 'sub_service' })
export class SubServiceModel extends Model<SubServiceModel> {
  @ForeignKey(() => ServiceModel)
  @AllowNull(false)
  @Column
  service_id: number;

  @AllowNull(true)
  @MaxLength(50)
  @Column
  sub_service_title: string;

  @AllowNull(true)
  @MaxLength(255)
  @Column
  sub_service_description: string;

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
