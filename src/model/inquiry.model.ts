import { MaxLength } from 'class-validator';
import {
  Table,
  Model,
  AllowNull,
  Column,
  IsEmail,
  Default,
  Sequelize,
} from 'sequelize-typescript';
import { Status } from '../libs/utils/constants/enum';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'inquiry' })
export class InquiryModel extends Model<InquiryModel> {
  @AllowNull(false)
  @MaxLength(50)
  @Column
  first_name: string;

  @AllowNull(false)
  @MaxLength(50)
  @Column
  last_name: string;

  @AllowNull(false)
  @MaxLength(50)
  @IsEmail
  @Column
  email: string;

  @AllowNull(false)
  @MaxLength(10)
  @Column
  phone_number: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  message: string;

  @AllowNull(false)
  @Default(Status.PENDING)
  @Column({
    type: DataTypes.ENUM(Status.PENDING, Status.RESOLVE),
  })
  status: string;

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
