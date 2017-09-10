import { Model, BaseModel } from '@encore2/model';
import { Address } from './address';

@Model()
export class User extends BaseModel {

  accessType?: 'user' | 'company' | 'admin';
  status?: 'Active' | 'Disabled' | 'Locked' | 'Reset';
  password?: string;
  activated?: boolean;
  hash?: string;
  salt?: string;
  resetToken?: string;
  resetExpires?: Date;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: Address;

  prePersist(): this {
    delete this.password; // Do not allow this to be saved;
    return super.prePersist();
  }
}