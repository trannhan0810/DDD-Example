import type { BaseEntity } from '@domain/base/base.entity';

export interface User extends BaseEntity {
  firstname: string;
  lastname: string;
  email: string;

  isEmailVerified: boolean;

  hashedPassword: string;
  resetPasswordCode: Nullable<string>;
  resetPasswordCodeExpireTime: Nullable<Date>;
}
