import { MaxLength } from 'class-validator';
import {
  Table,
  Model,
  AllowNull,
  Column,
  HasMany,
  Default,
  Sequelize,
  HasOne,
} from 'sequelize-typescript';
import { ImageModel } from './images.model';
import { SubServiceModel } from './sub_service.model';
import { ServiceDetailsModel } from './service_details.model';

@Table({ tableName: 'service' })
export class ServiceModel extends Model<ServiceModel> {
  @AllowNull(false)
  @MaxLength(50)
  @Column
  service_name: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  service_description: string;

  @HasOne(() => ImageModel)
  imageDetails: ImageModel;

  @HasMany(() => SubServiceModel)
  subServices: SubServiceModel[];

  @HasMany(() => ServiceDetailsModel)
  serviceDetails: ServiceDetailsModel[];

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
