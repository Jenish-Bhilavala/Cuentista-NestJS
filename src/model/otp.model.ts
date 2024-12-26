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

@Table({ tableName: 'otp', timestamps: false })
export class OTPModel extends Model<OTPModel> {
  @AllowNull(false)
  @MaxLength(50)
  @IsEmail
  @Column
  email: string;

  @AllowNull(false)
  @Column
  otp: number;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: 'TIMESTAMP' })
  createdAt: Date;

  @Default(
    Sequelize.fn(
      'DATE_ADD',
      Sequelize.literal('CURRENT_TIMESTAMP'),
      Sequelize.literal('INTERVAL 5 MINUTE')
    )
  )
  @Column({ type: 'TIMESTAMP' })
  expiresAt: Date;
}
