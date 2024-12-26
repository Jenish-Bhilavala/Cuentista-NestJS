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

@Table({ tableName: 'admin' })
export class AdminModel extends Model<AdminModel> {
  @AllowNull(false)
  @MaxLength(50)
  @Column
  name: string;

  @AllowNull(false)
  @MaxLength(50)
  @IsEmail
  @Column
  email: string;

  @AllowNull(false)
  @MaxLength(255)
  @Column
  password: string;

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
