import { Model, Field, BaseModel } from '@encore/model';

export class Address {

  @Field({ type: String, required: true })
  street1: string;

  @Field(String)
  street2: string;

  @Field({ type: String, required: true })
  city: string;

  @Field({ type: String, required: true })
  stateOrProvince: string;

  @Field({ type: String, required: true })
  zip: string;

  @Field({ type: String, required: true })
  country: string;

  constructor(data?: any) {
    BaseModel.bindData(this, data);
  }
}