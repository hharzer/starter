import { Model, Field, BaseModel, enumKeys } from '@encore/model';
import { Address } from './address';
import { UserStatus } from './status';
import { AccessType } from './access-type';

@Model()
export class User extends BaseModel {

  @Field({ type: String, enum: enumKeys(AccessType) })
  accessType: string;

  @Field({ type: String, enum: enumKeys(UserStatus) })
  status: string;

  @Field(String)
  password: string;

  @Field(Boolean)
  activated: boolean;

  @Field(String)
  hash: string;

  @Field(String)
  salt: string;

  @Field(String)
  resetToken: string;

  @Field(Date)
  resetExpires: Date;

  @Field({ type: String, required: true })
  firstName: string;

  @Field({ type: String, required: true })
  lastName: string;

  @Field({ type: String, required: true })
  email: string;

  @Field({ type: String, required: false })
  phone: string;

  @Field(Address)
  address: Address;

  preSave(): this {
    delete this.password; // Do not allow this to be saved;
    return super.preSave();
  }

  constructor(data?: any) {
    super(data);
    if (data && data.address) {
      this.address = new Address(data.address);
    }
  }
}